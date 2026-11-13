-- جدول ویدیوهای آپارات برای هر مراسم
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  aparat_id text not null,
  thumbnail text,
  duration text,
  created_at timestamptz default now()
);
alter table videos enable row level security;
create policy "public read videos" on videos for select using (true);
create policy "allow insert videos" on videos for insert with check (true);

-- ویدیوهای مراسم 12 آبان از آپارات fadakinfo
-- (event_id به صورت خودکار از مراسم 12 آبان پیدا می‌شود)
insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | یوحنا', 'lwoa2g7', 'https://static.cdn.asset.aparat.com/avt/74064702-3882-l__6425.jpg?width=700&quality=90&secret=-pduQZv2VGcvr0Bj-UNzWA', '03:51'
from events where title like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | میگن اسمت غمه حسین', 'tmfa8na', 'https://static.cdn.asset.aparat.com/avt/74064693-5914-l__6302.jpg?width=700&quality=90&secret=rlTAIpsu5qMB7tnVjU5LpQ', '04:39'
from events where title like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | جهان مانوس اباالفضل', 'memn0sj', 'https://static.cdn.asset.aparat.com/avt/74064685-2839-l__7780.jpg?width=700&quality=90&secret=Nx_ZN_TFHVbTrrQ8MV_Otg', '04:56'
from events where title like '%12 آبان%' limit 1;

insert into videos (event_id, title, aparat_id, thumbnail, duration)
select id, 'شور | دارد از دور می آید نور', 'gjd6x2k', 'https://static.cdn.asset.aparat.com/avt/74064670-5167-l__8563.jpg?width=700&quality=90&secret=9V3VJl3o5vtCFhgXq2MlNw', '02:18'
from events where title like '%12 آبان%' limit 1;
