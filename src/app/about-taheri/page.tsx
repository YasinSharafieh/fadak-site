export default function AboutTaheriPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#0b3d2e] text-5xl font-extrabold text-[#14a3a2]">ح</div>
        <h1 className="mt-6 text-3xl font-extrabold text-white">کربلایی حسین طاهری</h1>
        <p className="mt-2 text-white/70/70">مداح اهل بیت (ع) | هیأت فدائیان حضرت زهرا (س)</p>
      </div>

      <div className="gold-frame mt-10 rounded-3xl bg-[#1a1a1a] p-8 md:p-10">
        <h2 className="text-xl font-extrabold text-white">درباره</h2>
        <div className="poem-text mt-4 space-y-4 leading-loose text-white/70/90">
          <p>
            کربلایی حسین طاهری از مداحان برجسته اهل بیت (ع) است که با صدای گرم و سبک خاص خود، سال‌هاست در هیأت فدائیان حضرت زهرا (س) به مداحی می‌پردازد.
          </p>
          <p>
            آثار ایشان در زمینه‌های مختلف مداحی از جمله شور، زمینه، روضه و مناجات در آرشیو فدک قابل دسترسی است.
          </p>
          <p>
            حسین طاهری همچنین در تولید نماهنگ‌ها و محتوای رسانه‌ای فعال است و آثار ایشان در کانال آپارات فدک منتشر می‌شود.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <a href="https://www.aparat.com/fadakinfo" target="_blank" rel="noopener noreferrer" className="card-hover rounded-2xl bg-[#0b3d2e] p-6 text-center text-white">
          <div className="text-3xl">🎬</div>
          <div className="mt-2 font-extrabold">کانال آپارات</div>
          <p className="mt-1 text-sm text-white/70">مشاهده نماهنگ‌ها و ویدیوها</p>
        </a>
        <a href="https://t.me/hoseintaheri_telegram" target="_blank" rel="noopener noreferrer" className="card-hover rounded-2xl bg-[#0e7c7b] p-6 text-center text-white">
          <div className="text-3xl">✈️</div>
          <div className="mt-2 font-extrabold">تلگرام</div>
          <p className="mt-1 text-sm text-white/70">کانال رسمی حسین طاهری</p>
        </a>
      </div>

      <div className="mt-8 text-center">
        <a href="/link" className="btn-gold rounded-full px-8 py-3">
          همه شبکه‌های اجتماعی
        </a>
      </div>
    </div>
  );
}
