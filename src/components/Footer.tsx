import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0B3D2E] text-[#F7F3E8]">
      <div className="islamic-pattern-dark">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <div className="text-xl font-extrabold">فدک</div>
            <p className="mt-2 text-sm leading-7 text-white/80">
              حسینیه مجازی هیأت فدائیان حضرت زهرا (س) — پایگاه حفظ و نشر آثار کربلایی حسین طاهری
            </p>
            <p className="mt-3 text-xs text-white/60">
              تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده، حسینیه سیدالشهدا (ع)
            </p>
          </div>
          <div>
            <div className="font-bold text-[#C9A227]">دسترسی سریع</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-[#C9A227]">مراسم آینده</Link></li>
              <li><Link href="/archive" className="hover:text-[#C9A227]">آرشیو مراسم</Link></li>
              <li><Link href="/khadam" className="hover:text-[#C9A227]">ثبت‌نام خادمین</Link></li>
              <li><Link href="/link" className="hover:text-[#C9A227]">صفحات حسین طاهری</Link></li>
              <li><Link href="https://gharaar.net" target="_blank" className="hover:text-[#C9A227]">قرار بی‌قرارها</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-[#C9A227]">شبکه‌های اجتماعی</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>اینستاگرام، تلگرام، ایتا، بله، روبیکا، آپارات</li>
              <li className="text-white/60">لینک‌ها در صفحه /link به‌روزرسانی می‌شوند</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © فدک — تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
