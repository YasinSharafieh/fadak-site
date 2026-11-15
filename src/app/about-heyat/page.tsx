export default function AboutHeyatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#0B3D2E] text-5xl font-extrabold text-[#C9A227]">ف</div>
        <h1 className="mt-6 text-3xl font-extrabold text-[#0B3D2E]">هیأت فدائیان حضرت زهرا (س)</h1>
        <p className="mt-2 text-[#3D2B1F]/70">فدک — پایگاه حفظ و نشر آثار</p>
      </div>

      <div className="gold-frame mt-10 rounded-3xl bg-white p-8 md:p-10">
        <h2 className="text-xl font-extrabold text-[#0B3D2E]">درباره هیئت</h2>
        <div className="poem-text mt-4 space-y-4 leading-loose text-[#3D2B1F]/90">
          <p>
            هیأت فدائیان حضرت زهرا (س) با هدف حفظ و نشر فرهنگ اهل بیت (ع) و برگزاری مراسم‌های مذهبی فعالیت می‌کند.
          </p>
          <p>
            مراسم‌های روضه هفتگی این هیئت هر سه‌شنبه در حسینیه سیدالشهدا (ع) تهران برگزار می‌شود.
          </p>
          <p>
            فدک به‌عنوان پایگاه دیجیتال هیئت، آرشیو کامل مراسم‌ها، صوت‌ها، ویدیوها و اشعار را در اختیار علاقه‌مندان قرار می‌دهد.
          </p>
        </div>
      </div>

      <div className="gold-frame mt-6 rounded-3xl bg-white p-8">
        <h2 className="text-xl font-extrabold text-[#0B3D2E]">نشانی</h2>
        <p className="mt-3 leading-7 text-[#3D2B1F]/80">
          تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار، حسینیه سیدالشهدا (ع)
        </p>
        <a href="https://www.openstreetmap.org/?mlat=35.725616&mlon=51.445673#map=16/35.725616/51.445673" target="_blank" rel="noopener noreferrer" className="btn-green mt-4 inline-block rounded-full px-6 py-3">
          🗺️ مسیریابی
        </a>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <a href="/khadam" className="card-hover rounded-2xl bg-[#0B3D2E] p-6 text-center text-white">
          <div className="text-3xl">🤝</div>
          <div className="mt-2 font-extrabold">خادم شوید</div>
        </a>
        <a href="/donate" className="card-hover rounded-2xl bg-[#0E7C7B] p-6 text-center text-white">
          <div className="text-3xl">❤️</div>
          <div className="mt-2 font-extrabold">کمک کنید</div>
        </a>
        <a href="https://gharaar.net/" target="_blank" rel="noopener noreferrer" className="card-hover rounded-2xl bg-[#C9A227] p-6 text-center text-[#0B3D2E]">
          <div className="text-3xl">🚐</div>
          <div className="mt-2 font-extrabold">قرار بی‌قرارها</div>
        </a>
      </div>
    </div>
  );
}
