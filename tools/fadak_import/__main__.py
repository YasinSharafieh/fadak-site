"""ورود آرشیو از کانال تلگرام.

این ابزار با اکانت کاربر کار می‌کند، نه با بات.
بات تاریخچه کانال را نمی‌بیند و فایل بالای ۲۰ مگابایت را دانلود نمی‌کند.
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SESSION_PATH = ROOT / "session.string"
HASH_PATH = ROOT / "phone_code_hash.txt"
ENV_PATH = ROOT / ".env"


def load_env() -> None:
    if not ENV_PATH.exists():
        return
    for line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"'))


def client():
    from telethon import TelegramClient
    from telethon.sessions import StringSession

    saved = SESSION_PATH.read_text(encoding="utf-8").strip() if SESSION_PATH.exists() else ""
    return TelegramClient(StringSession(saved), int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"])


async def cmd_login_request(phone: str) -> None:
    tg = client()
    await tg.connect()
    sent = await tg.send_code_request(phone)
    # کد تلگرام به همین نشست وصل است؛ باید قبل از قطع ذخیره شود.
    SESSION_PATH.write_text(tg.session.save(), encoding="utf-8")
    HASH_PATH.write_text(sent.phone_code_hash, encoding="utf-8")
    print("CODE_SENT")
    await tg.disconnect()


async def cmd_login_code(phone: str, code: str) -> None:
    from telethon.errors import SessionPasswordNeededError

    tg = client()
    await tg.connect()
    try:
        await tg.sign_in(phone=phone, code=code, phone_code_hash=HASH_PATH.read_text(encoding="utf-8").strip())
    except SessionPasswordNeededError:
        SESSION_PATH.write_text(tg.session.save(), encoding="utf-8")
        print("NEEDS_2FA")
        await tg.disconnect()
        return
    SESSION_PATH.write_text(tg.session.save(), encoding="utf-8")
    HASH_PATH.unlink(missing_ok=True)
    print("SESSION_SAVED")
    await tg.disconnect()


async def cmd_login_password(password: str) -> None:
    tg = client()
    await tg.connect()
    await tg.sign_in(password=password)
    SESSION_PATH.write_text(tg.session.save(), encoding="utf-8")
    print("SESSION_SAVED")
    await tg.disconnect()


async def cmd_search(channel: str, query: str, limit: int) -> None:
    from .parse import extract_date, get_subtitle, is_announcement

    tg = client()
    await tg.connect()
    if not await tg.is_user_authorized():
        raise SystemExit("اول باید ورود تلگرام انجام شود")
    entity = await tg.get_entity(channel)
    print(f"CHANNEL {getattr(entity, 'title', channel)}")
    async for msg in tg.iter_messages(entity, search=query, limit=limit):
        text = msg.message or ""
        kind = "text"
        size = 0
        if msg.photo:
            kind = "photo"
        elif msg.voice or msg.audio:
            kind = "audio"
            size = getattr(msg.file, "size", 0) or 0
        elif msg.video:
            kind = "video"
            size = getattr(msg.file, "size", 0) or 0
        elif msg.document:
            kind = "document"
            size = getattr(msg.file, "size", 0) or 0
        flag = "ANNOUNCE" if is_announcement(text) else ""
        print(
            f"{msg.id}\t{msg.date.isoformat()}\t{kind}\t{size}\t{extract_date(text) or '-'}\t{flag}\t{get_subtitle(text) or text.splitlines()[0][:70] if text else ''}"
        )
    await tg.disconnect()


async def cmd_ceremony(channel: str, date: str, commit: bool) -> None:
    from .ceremony import import_ceremony

    tg = client()
    await tg.connect()
    if not await tg.is_user_authorized():
        raise SystemExit("اول باید ورود تلگرام انجام شود")
    report = await import_ceremony(tg, channel, date, commit=commit)
    await tg.disconnect()
    print(report)


def main() -> None:
    load_env()
    parser = argparse.ArgumentParser(description="ورود آرشیو فدک از تلگرام")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("login-request")
    p.add_argument("--phone", required=True)

    p = sub.add_parser("login-code")
    p.add_argument("--phone", required=True)
    p.add_argument("--code", required=True)

    p = sub.add_parser("login-password")
    p.add_argument("--password", required=True)

    p = sub.add_parser("search")
    p.add_argument("--channel", required=True)
    p.add_argument("--query", required=True)
    p.add_argument("--limit", type=int, default=40)

    p = sub.add_parser("ceremony")
    p.add_argument("--channel", required=True)
    p.add_argument("--date", required=True, help="مثلاً ۱۲ آبان")
    p.add_argument("--commit", action="store_true")

    args = parser.parse_args()
    if args.cmd == "login-request":
        asyncio.run(cmd_login_request(args.phone))
    elif args.cmd == "login-code":
        asyncio.run(cmd_login_code(args.phone, args.code))
    elif args.cmd == "login-password":
        asyncio.run(cmd_login_password(args.password))
    elif args.cmd == "search":
        asyncio.run(cmd_search(args.channel, args.query, args.limit))
    elif args.cmd == "ceremony":
        asyncio.run(cmd_ceremony(args.channel, args.date, args.commit))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
