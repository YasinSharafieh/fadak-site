import { fadakMapUrl } from "@/data/mock";

export default function AboutHeyatPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <img src="/brand/heyat-mark.png" alt="هیئت فدائیان حضرت زهرا (س)" className="mx-auto h-52 w-auto object-contain sm:h-64" />
        <img src="/brand/fadak-wordmark.png" alt="فدک" className="mx-auto mt-6 h-16 w-auto object-contain sm:h-20" />
        <h1 className="mt-6 text-3xl font-extrabold text-white">هیأت فدائیان حضرت زهرا (س)</h1>
        <p className="mt-2 text-white/70/70">فدک — پایگاه حفظ و نشر آثار</p>
      </div>

      <div className="gold-frame mt-10 rounded-3xl bg-[#1a1a1a] p-8 md:p-10">
        <h2 className="text-xl font-extrabold text-white">درباره هیئت</h2>
        <div className="poem-text mt-4 space-y-4 leading-loose text-white/70/90">
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

      <div className="gold-frame mt-6 rounded-3xl bg-[#1a1a1a] p-8">
        <h2 className="text-xl font-extrabold text-white">نشانی</h2>
        <p className="mt-3 leading-7 text-white/70/80">
          تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار، حسینیه سیدالشهدا (ع)
        </p>
        <a href={fadakMapUrl} target="_blank" rel="noopener noreferrer" className="btn-green mt-4 inline-block rounded-full px-6 py-3">
          🗺️ مسیریابی
        </a>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <a href="/khadam" className="card-hover rounded-2xl bg-[#0b3d2e] p-6 text-center text-white">
          <div className="text-3xl">🤝</div>
          <div className="mt-2 font-extrabold">خادم شوید</div>
        </a>
        <a href="/donate" className="card-hover rounded-2xl bg-[#0e7c7b] p-6 text-center text-white">
          <div className="text-3xl">❤️</div>
          <div className="mt-2 font-extrabold">کمک کنید</div>
        </a>
        <a href="https://gharaar.net/" target="_blank" rel="noopener noreferrer" className="card-hover rounded-2xl bg-[#0e7c7b] p-6 text-center text-white">
          <div className="text-3xl">🚐</div>
          <div className="mt-2 font-extrabold">قرار بی‌قرارها</div>
        </a>
      </div>
    </div>
  );
}
