-- پاک کردن همه ویدیوهای فعلی
delete from videos;

-- درست کردن مراسم 12 آبان طبق متن تلگرام
update events
set title = 'مجلس روضه هفتگی',
    speaker = 'شیخ اسماعیل رمضانی',
    maddah = 'کربلایی محمد اسداللهی، کربلایی حسین طاهری، کربلایی علیرضا طاهری',
    date_fa = 'سه‌شنبه ۱۲ آبان ۱۴۰۵',
    description = 'مجلس روضه هفتگی' || chr(10) || 'سخنران: شیخ اسماعیل رمضانی' || chr(10) || 'مداحان: کربلایی محمد اسداللهی، کربلایی حسین طاهری، کربلایی علیرضا طاهری'
where title like '%12 آبان%' or date_fa like '%12 آبان%';

-- ویدیوهای آپارات مراسم 12 آبان (مطابق صوت‌ها، با همان عنوان یک‌خطی)
insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | یوحنا', 'lwoa2g7', 'https://static.cdn.asset.aparat.com/avt/74064702-3882-l__6425.jpg?width=700&quality=90&secret=-pduQZv2VGcvr0Bj-UNzWA', '03:51'
from events where title like '%روضه هفتگی%' and date_fa like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | میگن اسمت غمه حسین', 'tmfa8na', 'https://static.cdn.asset.aparat.com/avt/74064693-5914-l__6302.jpg?width=700&quality=90&secret=rlTAIpsu5qMB7tnVjU5LpQ', '04:39'
from events where title like '%روضه هفتگی%' and date_fa like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | جهان مانوس اباالفضل', 'memn0sj', 'https://static.cdn.asset.aparat.com/avt/74064685-2839-l__7780.jpg?width=700&quality=90&secret=Nx_ZN_TFHVbTrrQ8MV_Otg', '04:56'
from events where title like '%روضه هفتگی%' and date_fa like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | دارد از دور می آید نور', 'gjd6x2k', 'https://static.cdn.asset.aparat.com/avt/74064670-5167-l__8563.jpg?width=700&quality=90&secret=9V3VJl3o5vtCFhgXq2MlNw', '02:18'
from events where title like '%روضه هفتگی%' and date_fa like '%12 آبان%' limit 1;
