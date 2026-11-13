-- اجازه درج مراسم از بات تلگرام (فقط درج، نه ویرایش/حذف)
create policy "allow insert events" on events for insert with check (true);
create policy "allow insert audios" on audios for insert with check (true);
create policy "allow insert photos" on photos for insert with check (true);
