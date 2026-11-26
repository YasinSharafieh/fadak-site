"""یک مراسم را کامل پیدا می‌کند. بدون --commit چیزی روی سایت نمی‌نویسد."""

from __future__ import annotations

import json
import re
from datetime import timedelta

from .parse import extract_date, get_subtitle, is_announcement, normalize, parse_ceremony, same_date

WEST_TO_FA = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")


def _search_forms(date_key: str) -> list[str]:
    western = normalize(date_key)
    forms = []
    for item in (date_key, western, western.translate(WEST_TO_FA)):
        if item and item not in forms:
            forms.append(item)
    return forms


from .store import SUPABASE_SAFE_BYTES, FileTooLarge, Store, guess_type


# اسلاگ فارسی در آدرس سایت پیدا نمی‌شود و صفحهٔ مراسم خالی می‌ماند.
MONTH_SLUG = {
    "فروردین": "farvardin",
    "اردیبهشت": "ordibehesht",
    "خرداد": "khordad",
    "تیر": "tir",
    "مرداد": "mordad",
    "شهریور": "shahrivar",
    "مهر": "mehr",
    "آبان": "aban",
    "آذر": "azar",
    "دی": "dey",
    "بهمن": "bahman",
    "اسفند": "esfand",
}


def _slug(date_key: str) -> str:
    text = normalize(date_key)
    for fa, en in MONTH_SLUG.items():
        text = text.replace(fa, en)
    text = re.sub(r"[^0-9a-z]+", "-", text.lower())
    text = re.sub(r"-+", "-", text).strip("-")
    return "majles-" + text


def _kind(msg) -> str:
    if msg.photo and not msg.video:
        return "photo"
    if msg.voice or msg.audio:
        return "audio"
    if msg.video:
        return "video"
    if msg.document and msg.file:
        mime = msg.file.mime_type or ""
        if mime.startswith("audio"):
            return "audio"
        if mime.startswith("image"):
            return "photo"
        if mime.startswith("video"):
            return "video"
    return "text"


async def _collect(client, entity, date_key: str) -> tuple[object | None, list]:
    announcement = None
    found = []
    seen = set()

    for form in _search_forms(date_key):
        async for msg in client.iter_messages(entity, search=form, limit=200):
            if msg.id in seen:
                continue
            seen.add(msg.id)
            text = msg.message or ""
            if is_announcement(text) and same_date(text, date_key):
                if announcement is None or msg.id < announcement.id:
                    announcement = msg
            found.append(msg)

    if announcement is None:
        return None, found

    # عکس و صوت گاهی کپشن تاریخ ندارند و فقط کنار اعلامیه هستند.
    # قبل از اعلامیه فقط همان آلبوم یا دو ساعت قبل. بعد از آن تا مراسم بعدی، حداکثر سه روز.
    async for msg in client.iter_messages(entity, min_id=max(announcement.id - 40, 0), reverse=True):
        text = msg.message or ""
        other = extract_date(text)
        if is_announcement(text) and other and other != date_key and msg.id > announcement.id:
            break
        if msg.date and announcement.date and msg.date > announcement.date + timedelta(days=3):
            break
        if msg.id < announcement.id:
            close_in_time = bool(
                msg.date and announcement.date and announcement.date - msg.date <= timedelta(hours=2)
            )
            same_album = bool(getattr(msg, "grouped_id", None) and msg.grouped_id == getattr(announcement, "grouped_id", None))
            if not (same_date(text, date_key) or close_in_time or same_album):
                continue
        if msg.id not in seen:
            seen.add(msg.id)
            found.append(msg)
        if len(found) > 250:
            break

    found.sort(key=lambda m: m.id)
    return announcement, found


async def import_ceremony(client, channel: str, date: str, commit: bool) -> str:
    date_key = extract_date(normalize(date)) or normalize(date)
    entity = await client.get_entity(channel)
    announcement, messages = await _collect(client, entity, date_key)

    rows = []
    for msg in messages:
        text = msg.message or ""
        kind = _kind(msg)
        size = int(getattr(msg.file, "size", 0) or 0) if msg.file else 0
        rows.append(
            {
                "id": msg.id,
                "kind": kind,
                "size": size,
                "date": extract_date(text) or "",
                "subtitle": get_subtitle(text),
                "announce": is_announcement(text) and same_date(text, date_key),
            }
        )

    parsed = parse_ceremony(announcement.message or "") if announcement else None
    photos = [r for r in rows if r["kind"] == "photo" and r["date"] in ("", date_key)]
    audios = [r for r in rows if r["kind"] == "audio" and r["date"] in ("", date_key)]
    videos = [r for r in rows if r["kind"] == "video"]
    too_big = [r for r in audios + photos if r["size"] > SUPABASE_SAFE_BYTES]

    report = {
        "channel": channel,
        "date_key": date_key,
        "commit": commit,
        "announcement_id": announcement.id if announcement else None,
        "parsed": parsed,
        "photos": len(photos),
        "audios": [{"id": a["id"], "title": a["subtitle"], "size": a["size"]} for a in audios],
        "telegram_videos_ignored": len(videos),
        "over_supabase_limit": [{"id": r["id"], "kind": r["kind"], "size": r["size"]} for r in too_big],
        "written": [],
        "skipped": [],
    }

    if not commit:
        report["note"] = "dry-run — چیزی نوشته نشد"
        return json.dumps(report, ensure_ascii=False, indent=2)

    if not parsed:
        report["error"] = "اعلامیه این تاریخ پیدا نشد؛ چیزی نوشته نشد"
        return json.dumps(report, ensure_ascii=False, indent=2)

    store = Store()
    event = store.find_event(date_key)
    if not event:
        event = store.create_event(parsed, _slug(date_key))
        report["written"].append({"event": event["id"], "slug": event["slug"]})
    else:
        report["skipped"].append({"event_exists": event["id"], "slug": event.get("slug")})

    by_id = {m.id: m for m in messages}
    channel_name = str(getattr(entity, "username", None) or channel)

    for row in photos:
        if store.seen(channel_name, row["id"]):
            report["skipped"].append({"photo": row["id"], "reason": "already-imported"})
            continue
        msg = by_id[row["id"]]
        try:
            data = await client.download_media(msg, bytes)
        except Exception as exc:  # noqa: BLE001 — گزارش شود، بقیه مراسم ادامه پیدا کند
            report["skipped"].append({"photo": row["id"], "reason": str(exc)})
            continue
        if not data:
            report["skipped"].append({"photo": row["id"], "reason": "empty"})
            continue
        try:
            url = store.upload("photos", f"{event['id']}/{row['id']}.jpg", data, "image/jpeg")
        except FileTooLarge as exc:
            report["skipped"].append({"photo": row["id"], "reason": "too-large", "size": exc.size})
            continue
        inserted = store.insert(
            "photos",
            {"event_id": event["id"], "url": url, "caption": row["subtitle"] or "عکس مراسم"},
        )
        store.mark(channel_name, row["id"], "photo", inserted["id"])
        report["written"].append({"photo": inserted["id"]})

    for row in audios:
        title = row["subtitle"] or "صوت مراسم"
        if store.seen(channel_name, row["id"]) or store.audio_exists(event["id"], title):
            report["skipped"].append({"audio": row["id"], "reason": "already-imported", "title": title})
            continue
        msg = by_id[row["id"]]
        ext = "mp3"
        if msg.file and msg.file.ext:
            ext = msg.file.ext.lstrip(".") or "mp3"
        try:
            data = await client.download_media(msg, bytes)
        except Exception as exc:  # noqa: BLE001
            report["skipped"].append({"audio": row["id"], "reason": str(exc), "title": title})
            continue
        if not data:
            report["skipped"].append({"audio": row["id"], "reason": "empty", "title": title})
            continue
        mime = guess_type(f"a.{ext}", "audio/mpeg")
        try:
            url = store.upload("audios", f"{event['id']}/{row['id']}.{ext}", data, mime)
        except FileTooLarge as exc:
            report["skipped"].append({"audio": row["id"], "reason": "too-large", "size": exc.size, "title": title})
            continue
        inserted = store.insert("audios", {"event_id": event["id"], "title": title, "file_url": url})
        store.mark(channel_name, row["id"], "audio", inserted["id"])
        report["written"].append({"audio": inserted["id"], "title": title})

    if videos:
        report["note"] = "ویدیوهای تلگرام عمداً آپلود نشدند. ویدیو فقط از آپارات، با همان عنوان صوت، و با پلیر داخل سایت اضافه می‌شود."
    return json.dumps(report, ensure_ascii=False, indent=2)
