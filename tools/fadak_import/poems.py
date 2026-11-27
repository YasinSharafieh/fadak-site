"""شعرهای مراسم‌های موجود سایت را از کانال دو خط شعر می‌خواند.

فقط همان مراسمی که روی سایت است. صوت خالی وارد نمی‌شود و شاعر ساخته نمی‌شود.
"""

from __future__ import annotations

import json
import re

from .parse import extract_date, normalize, same_date

POETRY_CHANNEL = "taheri_sher"
HEADER = "اشعار اجرا شده"
DECOR = set("❖━─—-_.*•·|▁▂▃▄▅▆▇█▓▒░═")
YEAR_RE = re.compile(r"1[34]\d{2}")


def extract_year(text: str) -> int | None:
    found = YEAR_RE.search(normalize(text))
    return int(found.group(0)) if found else None


def header_matches(text: str, date_key: str, year: int | None) -> bool:
    if HEADER not in (text or ""):
        return False
    if not date_key or not same_date(text, date_key):
        return False
    found_year = extract_year(text)
    if year and found_year != year:
        return False
    return True


def content_lines(text: str) -> list[str]:
    lines = []
    for raw in (text or "").splitlines():
        line = raw.strip().strip("\u200c")
        if not line:
            continue
        if all(ch in DECOR or ch.isspace() for ch in line):
            continue
        if line in {".", "..", "...", ".....", "….."}:
            continue
        lines.append(line)
    return lines


def poem_title(lines: list[str]) -> str:
    if not lines:
        return "شعر مراسم"
    return re.sub(r"\s+", " ", lines[0]).strip(" .")[:90] or "شعر مراسم"


def poem_body(lines: list[str]) -> str:
    return "\n".join(lines)


def body_key(body: str) -> str:
    return re.sub(r"\s+", " ", body or "").strip()


def _search_forms(date_fa: str, date_key: str, year: int | None) -> list[str]:
    western = normalize(date_key)
    persian = western.translate(str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹"))
    arabic = western.translate(str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩"))
    forms = [date_fa, date_key, western, persian, arabic]
    if year:
        forms.append(f"{persian} {year}")
        forms.append(f"{western} {year}")
    unique = []
    for item in forms:
        if item and item not in unique:
            unique.append(item)
    return unique


async def _header(client, entity, date_fa: str):
    date_key = extract_date(date_fa or "") or ""
    year = extract_year(date_fa or "")
    found = {}
    for form in _search_forms(date_fa, date_key, year):
        async for msg in client.iter_messages(entity, search=form, limit=30):
            text = msg.message or ""
            if header_matches(text, date_key, year):
                found[msg.id] = msg
    if not found:
        return None
    return found[max(found)]


async def _poems_after(client, entity, header) -> list[dict]:
    poems = []
    async for msg in client.iter_messages(entity, min_id=header.id, reverse=True, limit=80):
        if msg.id == header.id:
            continue
        text = (msg.message or "").strip()
        if HEADER in text:
            break
        if not text or len(text) < 40:
            continue
        lines = content_lines(text)
        body = poem_body(lines)
        if len(body) < 40:
            continue
        poems.append(
            {
                "telegram_id": msg.id,
                "created_at": msg.date.isoformat(),
                "title": poem_title(lines),
                "body": body,
            }
        )
    return poems


async def sync_event_poems(client, event: dict, commit: bool, entity=None) -> dict:
    from .store import Store

    date_fa = event.get("date_fa") or ""
    entity = entity or await client.get_entity(POETRY_CHANNEL)
    header = await _header(client, entity, date_fa)
    report = {
        "event_id": event.get("id"),
        "slug": event.get("slug"),
        "date_fa": date_fa,
        "header_id": header.id if header else None,
        "found": 0,
        "written": 0,
        "skipped": 0,
    }
    if not header:
        report["note"] = "در کانال شعر برای این تاریخ متنی نبود"
        return report
    poems = await _poems_after(client, entity, header)
    report["found"] = len(poems)
    if not commit or not event.get("id"):
        report["titles"] = [poem["title"] for poem in poems]
        return report

    store = Store()
    existing = {body_key(body) for body in store.poem_bodies(event["id"])}
    channel = str(getattr(entity, "username", None) or POETRY_CHANNEL)
    for poem in poems:
        key = body_key(poem["body"])
        if key in existing or store.seen(channel, poem["telegram_id"]):
            report["skipped"] += 1
            continue
        inserted = store.insert(
            "poems",
            {
                "title": poem["title"],
                "body": poem["body"],
                "event_id": event["id"],
                "created_at": poem["created_at"],
            },
        )
        store.mark(channel, poem["telegram_id"], "poem", inserted["id"])
        existing.add(key)
        report["written"] += 1
    return report


async def sync_site_poems(client, commit: bool) -> str:
    from .store import Store

    store = Store()
    events = [event for event in store.list_events() if event.get("date_fa")]
    entity = await client.get_entity(POETRY_CHANNEL)
    rows = []
    for event in events:
        rows.append(await sync_event_poems(client, event, commit, entity))
    return json.dumps(
        {"channel": POETRY_CHANNEL, "commit": commit, "events": rows},
        ensure_ascii=False,
        indent=2,
    )
