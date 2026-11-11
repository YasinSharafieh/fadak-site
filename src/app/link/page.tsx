import Link from "next/link";
import { socialLinks } from "@/data/mock";

export default function LinkPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="gold-frame rounded-3xl bg-white p-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0B3D2E] text-3xl font-bold text-[#F7F3E8]">
          ف
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0B3D2E]">کربلایی حسین طاهری</h1>
        <p className="mt-1 text-sm text-[#3D2B1F]/70">همه صفحات رسمی فدک در یک صفحه — برای بیوی اینستاگرام</p>
        <div className="mt-6 space-y-3 text-right">
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border border-[#C9A227]/40 bg-[#F7F3E8] p-4 hover:bg-[#0B3D2E] hover:text-[#F7F3E8]"
            >
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-xs opacity-70">{s.desc}</div>
              </div>
              <span>←</span>
            </a>
          ))}
          <Link href="/" className="block rounded-2xl bg-[#0B3D2E] p-4 text-center font-bold text-[#F7F3E8]">
            بازگشت به سایت فدک
          </Link>
        </div>
      </div>
    </div>
  );
}
