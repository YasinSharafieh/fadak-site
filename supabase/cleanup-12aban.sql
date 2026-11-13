-- تمیز کردن خودکار: همه رسانه‌ها زیر اولین مراسم بات (12 آبان) جمع می‌شوند
-- ⚠️ فقط یک بار اجرا کن

-- ۱. عنوان مراسم اصلی رو درست کن (اولین مراسم بات)
update events
set title = 'روضه هفتگی 12 آبان', date_fa = '12 آبان 1405'
where id = (select id from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at asc limit 1);

-- ۲. همه صوت‌ها و عکس‌ها رو به مراسم اصلی منتقل کن
update audios set event_id = (select id from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at asc limit 1);
update photos set event_id = (select id from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at asc limit 1);

-- ۳. مراسم‌های تکراری بات رو حذف کن (به جز مراسم اصلی)
delete from events
where (slug like 'tg-%' or slug like 'fwd-%')
  and id != (select id from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at asc limit 1);

-- ۴. (اختیاری) حذف مراسم‌های نمونه اولیه
-- delete from events where slug in ('14-mehr', 'roze-haftagi');
