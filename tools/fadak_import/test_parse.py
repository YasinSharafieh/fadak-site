from parse import extract_date, get_subtitle, parse_ceremony

sample = """📌 مجلس روضه هفتگی
سخنران: شیخ اسماعیل رمضانی
مداحان:
#کربلایی_حسین_طاهری
#کربلایی_علیرضا_طاهری
📅 سه‌شنبه ۱۲ آبان ۱۴۰۵
"""

audio = """شور | یوحنا
مجلس روضه هفتگی | سه‌شنبه ۱۲ آبان ۱۴۰۵
#کربلایی_حسین_طاهری
"""

parsed = parse_ceremony(sample)
assert parsed["title"] == "مجلس روضه هفتگی", parsed
assert "اسماعیل" in parsed["speaker"], parsed
assert "حسین طاهری" in parsed["maddah"], parsed
assert "علیرضا طاهری" in parsed["maddah"], parsed
assert "فدائیان" not in parsed["maddah"]
assert parsed["date_key"] == "12 آبان", parsed
assert parsed["description"].count("\n") == 2
assert get_subtitle(audio) == "شور | یوحنا"
assert extract_date("۱۴ مهر") == "14 مهر"
assert extract_date("۰۷ مهر ۱۴۰۵") == "7 مهر"
print("parse ok")
