-- پاک‌سازی مراسم‌های تکراری ساخته‌شده توسط بات (فقط مراسم‌های tg-/fwd-)
-- اول همه صوت/عکس‌ها رو به یک مراسم اصلی (قدیمی‌ترین) منتقل می‌کنیم، بعد بقیه رو حذف می‌کنیم
-- ⚠️ این اسکریپت رو فقط یک بار اجرا کن

-- پیدا کردن مراسم اصلی 12 آبان (اگر هست)
-- اگر مراسم 12 آبان وجود ندارد، این اسکریپت کاری نمی‌کند

-- منتقل کردن همه audios به اولین مراسم
-- (این بخش دستی با Table Editor هم قابل انجامه)

-- حذف مراسم‌های تکراری بات (slug با tg- یا fwd- شروع می‌شود) به جز اولین آن‌ها
-- برای امنیت، اول لیست رو ببین:
-- select id, title, slug, created_at from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at;

-- بعد از بررسی، این خط رو اجرا کن (اولین مراسم بات رو نگه می‌دارد):
-- delete from events where (slug like 'tg-%' or slug like 'fwd-%') and id not in (select id from events where slug like 'tg-%' or slug like 'fwd-%' order by created_at limit 1);
