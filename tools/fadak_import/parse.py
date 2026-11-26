"""همان قواعد مراسم که روی سایت اعمال شده — توضیح کوتاه، زیرنویس یک‌خطی."""

import re

MONTHS = (
    "فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند"
)
FA_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
STOP_MARKS = ("📅", "🗓", "⬇️", "🔹", "www.", "💠", "📷")


def normalize(text: str) -> str:
    return (text or "").translate(FA_DIGITS).replace("ي", "ی").replace("ك", "ک").strip()


def extract_date(text: str) -> str | None:
    src = normalize(text)
    m = re.search(rf"(\d{{1,2}})\s+({MONTHS})", src)
    if not m:
        return None
    return f"{int(m.group(1))} {m.group(2)}"


def get_subtitle(text: str) -> str:
    if not text:
        return ""
    sub = text.split("\n")[0].strip()
    sub = sub.split("مجلس")[0].strip()
    sub = re.sub(r"#\S+", "", sub).strip()
    sub = re.sub(r"^[🔊📷🎬📌📅🗓🎙\s|]+", "", sub).strip()
    sub = re.sub(r"[|\s]+$", "", sub).strip()
    return sub[:80]


def extract_maddahs(text: str) -> str:
    tags = re.findall(r"#(?:کربلایی|حاج)_[^\s#]+", text or "")
    names = []
    for tag in tags:
        clean = tag.replace("#", "").replace("_", " ").strip()
        if clean and "فدائیان" not in clean and clean not in names:
            names.append(clean)
    return "، ".join(names) if names else "کربلایی حسین طاهری"


def parse_ceremony(text: str) -> dict:
    lines = [ln.strip() for ln in (text or "").split("\n") if ln.strip()]
    title = ""
    speaker = ""
    maddahs: list[str] = []
    date_fa = ""
    in_maddah = False

    for line in lines:
        if "📌" in line:
            title = line.replace("📌|", "").replace("📌", "").strip()
        if "سخنران" in line:
            parts = line.split(":")
            speaker = (parts[1] if len(parts) > 1 else "").strip()
            in_maddah = False
        elif "مداحان" in line or "مداح :" in line:
            in_maddah = True
        elif "📅" in line:
            date_fa = line.replace("📅|", "").replace("📅", "").strip()
            in_maddah = False
        elif in_maddah:
            if any(mark in line for mark in STOP_MARKS):
                in_maddah = False
            elif line.startswith("#") or "کربلایی" in line or "حاج" in line:
                clean = line.replace("#", "").replace("_", " ").strip()
                if clean and "فدائیان" not in clean:
                    maddahs.append(clean)
            elif line:
                maddahs.append(line)

    speaker_idx = next((i for i, ln in enumerate(lines) if "سخنران" in ln), -1)
    if not speaker and speaker_idx >= 0 and speaker_idx + 1 < len(lines):
        speaker = lines[speaker_idx + 1].strip()

    maddahs = [name for name in maddahs if "🗓" not in name and "📅" not in name and not extract_date(name)]
    maddah = "، ".join(dict.fromkeys(maddahs)) if maddahs else extract_maddahs(text)
    description = "\n".join(
        part
        for part in (
            title,
            f"سخنران: {speaker}" if speaker else "",
            f"مداحان: {maddah}" if maddah else "",
        )
        if part
    )
    return {
        "title": title or "مراسم فدک",
        "speaker": speaker,
        "maddah": maddah,
        "date_fa": date_fa or (extract_date(text) or ""),
        "date_key": extract_date(date_fa or text or ""),
        "description": description,
    }


def is_announcement(text: str) -> bool:
    src = text or ""
    return "📌" in src or "سخنران" in src or "مداحان" in src


def same_date(text: str, date_key: str) -> bool:
    if not date_key:
        return False
    found = extract_date(text or "")
    return found == date_key
