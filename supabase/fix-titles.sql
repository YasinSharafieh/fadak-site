-- کوتاه کردن عنوان صوت‌ها: فقط بخش اول قبل از "مجلس" (مثل شور | لم داده‌ام...)
-- این کوئری عنوان‌ها رو تمیز می‌کنه
update audios
set title = trim(split_part(title, 'مجلس', 1))
where title like '%مجلس%';

-- حذف کاراکتر | اضافی از انتهای عنوان
update audios
set title = trim(regexp_replace(title, '\|\s*$', ''))
where title like '%|';

-- حذف هشتگ‌ها از عنوان
update audios
set title = trim(regexp_replace(title, '#\S+', '', 'g'))
where title like '%#%';
