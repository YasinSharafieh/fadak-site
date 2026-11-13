-- ساخت باکت‌های ذخیره‌سازی برای عکس و صوت مراسم‌ها
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('audios', 'audios', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('videos', 'videos', true) on conflict (id) do nothing;

-- سیاست‌های دسترسی عمومی برای آپلود/خواندن (ساده برای شروع)
create policy "public read photos" on storage.objects for select using (bucket_id = 'photos');
create policy "public insert photos" on storage.objects for insert with check (bucket_id = 'photos');
create policy "public read audios" on storage.objects for select using (bucket_id = 'audios');
create policy "public insert audios" on storage.objects for insert with check (bucket_id = 'audios');
create policy "public read videos" on storage.objects for select using (bucket_id = 'videos');
create policy "public insert videos" on storage.objects for insert with check (bucket_id = 'videos');
