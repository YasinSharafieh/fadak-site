-- فدک — اسکیمای دیتابیس Supabase
-- این فایل رو تو SQL Editor اجرا کن

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  date_fa text,
  date_hijri text,
  speaker text,
  maddah text default 'کربلایی حسین طاهری',
  location text,
  address text,
  map_url text,
  poster_url text,
  description text,
  status text check (status in ('upcoming','past')) default 'upcoming',
  created_at timestamptz default now()
);

create table if not exists audios (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  title text not null,
  file_url text not null,
  duration text,
  plays int default 0,
  created_at timestamptz default now()
);

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  url text not null,
  caption text,
  created_at timestamptz default now()
);

create table if not exists poems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  poet text,
  body text not null,
  event_id uuid references events(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists reels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_url text not null,
  cover_url text,
  duration text,
  created_at timestamptz default now()
);

create table if not exists khadam_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile text not null,
  city text,
  service_type text,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text,
  amount int,
  authority text,
  created_at timestamptz default now()
);

create table if not exists hadith_cache (
  day date primary key,
  text text not null,
  translation text,
  source text
);

-- فعال‌سازی RLS (امنیت پایه)
alter table events enable row level security;
alter table audios enable row level security;
alter table photos enable row level security;
alter table poems enable row level security;
alter table reels enable row level security;
alter table khadam_requests enable row level security;
alter table donations enable row level security;
alter table hadith_cache enable row level security;

-- سیاست خواندن عمومی
create policy "public read events" on events for select using (true);
create policy "public read audios" on audios for select using (true);
create policy "public read photos" on photos for select using (true);
create policy "public read poems" on poems for select using (true);
create policy "public read reels" on reels for select using (true);
create policy "public read hadith" on hadith_cache for select using (true);

-- سیاست درج عمومی برای فرم خادمین و کمک
create policy "public insert khadam" on khadam_requests for insert with check (true);
create policy "public insert donations" on donations for insert with check (true);

-- داده نمونه
insert into events (title, slug, date_fa, date_hijri, maddah, location, status) values
('مجلس روضه هفتگی', 'roze-haftagi', 'سه‌شنبه ۲۱ آبان ۱۴۰۵ — ساعت ۱۹:۳۰', '۲۱ جمادی‌الثانی ۱۴۴۸', 'کربلایی حسین طاهری', 'حسینیه سیدالشهدا (ع)، تهران', 'upcoming'),
('مجلس روضه هفتگی — ۱۴ مهر ۱۴۰۵', '14-mehr', '۱۴ مهر ۱۴۰۵', '۱۴ ربیع‌الثانی ۱۴۴۸', 'کربلایی حسین طاهری', 'حسینیه سیدالشهدا (ع)', 'past')
on conflict (slug) do nothing;

insert into hadith_cache (day, text, translation, source) values
(current_date, 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', 'همانا اعمال به نیت‌ها بستگی دارد.', 'پیامبر اکرم (ص) — بحارالانوار')
on conflict (day) do nothing;
