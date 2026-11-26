"""نوشتن مراسم در Supabase. فایل بزرگ‌تر از سقف پلن، آپلود نمی‌شود."""

from __future__ import annotations

import json
import mimetypes
import os
import random
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# سقف عملی پلن رایگان. باکت خودش محدودیتی نگذاشته، ولی پلتفرم بالای این را رد می‌کند.
SUPABASE_SAFE_BYTES = 45 * 1024 * 1024

ROOT = Path(__file__).resolve().parent
LEDGER_PATH = ROOT / "ledger.json"


def env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"متغیر {name} تنظیم نشده است")
    return value


def _request(method: str, url: str, body: bytes | None = None, headers: dict | None = None) -> tuple[int, bytes]:
    req = urllib.request.Request(url, data=body, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as res:
            return res.status, res.read()
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read()


class Store:
    def __init__(self) -> None:
        self.base = env("SUPABASE_URL").rstrip("/")
        self.key = env("SUPABASE_SECRET")
        self.ledger = self._load_ledger()

    def _headers(self, extra: dict | None = None) -> dict:
        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
        }
        if extra:
            headers.update(extra)
        return headers

    def _load_ledger(self) -> dict:
        if LEDGER_PATH.exists():
            return json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
        return {"messages": {}}

    def save_ledger(self) -> None:
        LEDGER_PATH.write_text(json.dumps(self.ledger, ensure_ascii=False, indent=2), encoding="utf-8")

    def seen(self, channel: str, message_id: int) -> bool:
        return f"{channel}:{message_id}" in self.ledger["messages"]

    def mark(self, channel: str, message_id: int, kind: str, ref: str) -> None:
        self.ledger["messages"][f"{channel}:{message_id}"] = {"kind": kind, "ref": ref}
        self.save_ledger()

    def list_events(self) -> list[dict]:
        query = urllib.parse.urlencode({"select": "id,title,date_fa,slug", "order": "created_at.desc", "limit": "100"})
        status, raw = _request("GET", f"{self.base}/rest/v1/events?{query}", headers=self._headers())
        if status != 200:
            raise RuntimeError(f"خواندن مراسم‌ها ناموفق: {status} {raw[:300]!r}")
        return json.loads(raw.decode() or "[]")

    def poem_bodies(self, event_id: str) -> list[str]:
        query = urllib.parse.urlencode({"select": "body", "event_id": f"eq.{event_id}", "limit": "200"})
        status, raw = _request("GET", f"{self.base}/rest/v1/poems?{query}", headers=self._headers())
        if status != 200:
            raise RuntimeError(f"خواندن شعرها ناموفق: {status} {raw[:300]!r}")
        return [row.get("body") or "" for row in json.loads(raw.decode() or "[]")]

    def find_event(self, date_key: str) -> dict | None:
        query = urllib.parse.urlencode(
            {
                "select": "*",
                "date_fa": f"ilike.*{date_key}*",
                "order": "created_at.desc",
                "limit": "1",
            }
        )
        status, raw = _request("GET", f"{self.base}/rest/v1/events?{query}", headers=self._headers())
        if status != 200:
            raise RuntimeError(f"جستجوی مراسم ناموفق: {status} {raw[:300]!r}")
        rows = json.loads(raw.decode() or "[]")
        return rows[0] if rows else None

    def create_event(self, parsed: dict, slug: str) -> dict:
        payload = json.dumps(
            {
                "title": parsed["title"],
                "slug": slug,
                "date_fa": parsed["date_fa"] or parsed["date_key"],
                "speaker": parsed["speaker"],
                "maddah": parsed["maddah"],
                "description": parsed["description"],
                "status": "past",
                "location": "حسینیه سیدالشهدا (ع)، تهران",
            },
            ensure_ascii=False,
        ).encode()
        status, raw = _request(
            "POST",
            f"{self.base}/rest/v1/events",
            payload,
            self._headers({"Content-Type": "application/json", "Prefer": "return=representation"}),
        )
        if status not in (200, 201):
            raise RuntimeError(f"ساخت مراسم ناموفق: {status} {raw[:400]!r}")
        rows = json.loads(raw.decode() or "[]")
        return rows[0]

    def lock_random_poster(self, event_id: str) -> str | None:
        """یک عکس تصادفی از همان مراسم را یک‌بار قفل می‌کند. اگر پوستر باشد، عوضش نمی‌کند."""
        query = urllib.parse.urlencode({"select": "id,poster_url", "id": f"eq.{event_id}", "limit": "1"})
        status, raw = _request("GET", f"{self.base}/rest/v1/events?{query}", headers=self._headers())
        if status != 200:
            raise RuntimeError(f"خواندن پوستر ناموفق: {status} {raw[:300]!r}")
        rows = json.loads(raw.decode() or "[]")
        if not rows:
            return None
        locked = rows[0].get("poster_url") or ""
        if locked:
            return locked

        photo_query = urllib.parse.urlencode(
            {
                "select": "url,caption,created_at",
                "event_id": f"eq.{event_id}",
                "order": "created_at.asc",
                "limit": "500",
            }
        )
        status, raw = _request("GET", f"{self.base}/rest/v1/photos?{photo_query}", headers=self._headers())
        if status != 200:
            raise RuntimeError(f"خواندن عکس‌های پوستر ناموفق: {status} {raw[:300]!r}")
        eligible = [
            row
            for row in json.loads(raw.decode() or "[]")
            if row.get("url") and "ویدیو" not in (row.get("caption") or "")
        ]
        eligible.sort(key=lambda row: (row.get("created_at") or "", row.get("url") or ""))
        if not eligible:
            return None
        pool = eligible[1:] if len(eligible) > 1 else eligible
        chosen = random.choice(pool)["url"]
        payload = json.dumps({"poster_url": chosen}, ensure_ascii=False).encode()
        status, raw = _request(
            "PATCH",
            f"{self.base}/rest/v1/events?id=eq.{event_id}",
            payload,
            self._headers({"Content-Type": "application/json", "Prefer": "return=minimal"}),
        )
        if status not in (200, 204):
            raise RuntimeError(f"قفل پوستر ناموفق: {status} {raw[:300]!r}")
        return chosen

    def audio_exists(self, event_id: str, title: str) -> bool:
        query = urllib.parse.urlencode(
            {"select": "id", "event_id": f"eq.{event_id}", "title": f"eq.{title}", "limit": "1"}
        )
        status, raw = _request("GET", f"{self.base}/rest/v1/audios?{query}", headers=self._headers())
        if status != 200:
            return False
        return bool(json.loads(raw.decode() or "[]"))

    def upload(self, bucket: str, path: str, data: bytes, content_type: str) -> str:
        if len(data) > SUPABASE_SAFE_BYTES:
            raise FileTooLarge(len(data))
        safe_path = urllib.parse.quote(path)
        status, raw = _request(
            "POST",
            f"{self.base}/storage/v1/object/{bucket}/{safe_path}",
            data,
            self._headers({"Content-Type": content_type, "x-upsert": "true"}),
        )
        if status not in (200, 201):
            raise RuntimeError(f"آپلود {bucket}/{path} ناموفق: {status} {raw[:300]!r}")
        return f"{self.base}/storage/v1/object/public/{bucket}/{safe_path}"

    def insert(self, table: str, row: dict) -> dict:
        status, raw = _request(
            "POST",
            f"{self.base}/rest/v1/{table}",
            json.dumps(row, ensure_ascii=False).encode(),
            self._headers({"Content-Type": "application/json", "Prefer": "return=representation"}),
        )
        if status not in (200, 201):
            raise RuntimeError(f"درج در {table} ناموفق: {status} {raw[:300]!r}")
        rows = json.loads(raw.decode() or "[]")
        return rows[0]


class FileTooLarge(Exception):
    def __init__(self, size: int) -> None:
        super().__init__(size)
        self.size = size


def guess_type(name: str, fallback: str) -> str:
    guessed, _ = mimetypes.guess_type(name)
    return guessed or fallback
