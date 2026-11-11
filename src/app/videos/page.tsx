export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">نماهنگ و ویدیو</h1>
      <p className="mt-2 text-[#3D2B1F]/80">نماهنگ‌های آپارات فدک — به‌صورت خودکار از کانال آپارات</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-white shadow">
            <div className="flex aspect-video items-center justify-center bg-[#0B3D2E] text-5xl text-[#C9A227]">▶</div>
            <div className="p-5">
              <div className="font-bold">نماهنگ فدک — بخش {i}</div>
              <div className="mt-1 text-sm text-[#3D2B1F]/70">از کانال آپارات حسین طاهری</div>
              <a href="https://www.aparat.com" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-[#0E7C7B]">مشاهده در آپارات ←</a>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-2xl bg-[#F7F3E8] p-4 text-sm">اتصال خودکار به API آپارات در فاز بعد فعال می‌شود — فعلاً لینک کانال نمایش داده می‌شود.</p>
    </div>
  );
}
