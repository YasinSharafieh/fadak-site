from tools.fadak_import.poems import content_lines, extract_year, header_matches, poem_body, poem_title

header_1405 = "سلام\nاشعار اجرا شده در:\nجلسه روضه هفتگی\nسه‌شنبه ۱۲ آبان ۱۴۰۵\n👇🏻"
header_1404 = "سلام\nاشعار اجرا شده در:\nشب شهادت حضرت زهرا\nدوشنبه 12 آبان ۱۴۰۴\n👇🏻"
assert header_matches(header_1405, "12 آبان", 1405)
assert not header_matches(header_1404, "12 آبان", 1405)
assert not header_matches("۱۲ آبان ۱۴۰۵ بدون عنوان شعر", "12 آبان", 1405)
assert extract_year("۲۷ اردیبهشت ۱۴۰۵") == 1405

raw = ".\n\n❖━━────━━❖\n\nدوباره شب شد و سر درد دارد\nبميرم باز مادر درد دارد\n"
lines = content_lines(raw)
assert lines[0] == "دوباره شب شد و سر درد دارد", lines
assert "❖" not in poem_body(lines)
assert poem_title(lines) == "دوباره شب شد و سر درد دارد"
print("poems ok")
