import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black border-t border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0e7c7b] text-xl font-extrabold text-white">ف</div>
              <div>
                <div className="text-lg font-extrabold">فدک</div>
                <div className="text-xs text-white/60">حفظ و نشر آثار کربلایی حسین طاهری</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              پایگاه حفظ و نشر آثار کربلایی حسین طاهری و هیأت فدائیان حضرت زهرا (س) — آرشیو زنده و مرجع دیجیتال.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-[#14a3a2]">نشانی</h3>
            <p className="mt-3 text-sm leading-6 text-white/70">
              تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار، حسینیه سیدالشهدا (ع)
            </p>
            <a href="https://www.openstreetmap.org/?mlat=35.725616&mlon=51.445673#map=16/35.725616/51.445673" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-[#14a3a2] hover:underline">
              🗺️ مشاهده روی نقشه
            </a>
          </div>

          <div>
            <h3 className="font-extrabold text-[#14a3a2]">دسترسی سریع</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/events" className="text-white/70 hover:text-[#14a3a2] transition">مراسم آینده</Link></li>
              <li><Link href="/archive" className="text-white/70 hover:text-[#14a3a2] transition">آرشیو مراسم</Link></li>
              <li><Link href="/audio" className="text-white/70 hover:text-[#14a3a2] transition">کتابخانه صوتی</Link></li>
              <li><Link href="/videos" className="text-white/70 hover:text-[#14a3a2] transition">نماهنگ‌ها</Link></li>
              <li><Link href="/reels" className="text-white/70 hover:text-[#14a3a2] transition">ریلز فدک</Link></li>
              <li><Link href="/poems" className="text-white/70 hover:text-[#14a3a2] transition">اشعار</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-[#14a3a2]">پیوندهای مرتبط</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="https://noorieh.ir/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#14a3a2] transition">پایگاه اطلاع‌رسانی نوریه</a></li>
              <li><a href="https://gharaar.net/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#14a3a2] transition">کاروان قرار بی‌قرارها</a></li>
              <li><a href="https://farsi.khamenei.ir/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#14a3a2] transition">پایگاه رهبر معظم انقلاب</a></li>
              <li><a href="https://fotros.ir/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#14a3a2] transition">پایگاه اطلاع‌رسانی فطرس</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          <p>هیأت فدائیان حضرت زهرا (س) — تمامی حقوق محفوظ است.</p>
          <p className="mt-2">ساخته شده با ❤️ برای حفظ و نشر آثار اهل بیت (ع)</p>
        </div>
      </div>
    </footer>
  );
}
