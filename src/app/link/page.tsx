import { socialLinks } from "@/data/mock";

export default function LinkPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 animate-fade-in">
      {/* هدر */}
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#0B3D2E] text-4xl font-extrabold text-[#C9A227]">ف</div>
        <h1 className="mt-4 text-2xl font-extrabold text-[#0B3D2E]">کربلایی حسین طاهری</h1>
        <p className="mt-2 text-sm text-[#3D2B1F]/70">هیأت فدائیان حضرت زهرا (س) | فدک</p>
        <p className="mt-1 text-xs text-[#3D2B1F]/60">همه شبکه‌های اجتماعی در یک صفحه</p>
      </div>

      {/* لینک‌ها */}
      <div className="mt-8 space-y-3">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-center gap-4 rounded-2xl bg-white p-4 shadow"
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="flex-1 font-bold">{link.name}</span>
            <span className="text-[#0E7C7B]">←</span>
          </a>
        ))}
      </div>

      {/* زیلینک */}
      <div className="mt-8 rounded-2xl bg-[#0B3D2E] p-6 text-center text-[#F7F3E8]">
        <p className="font-bold">زیلینک رسمی طاهری‌نت</p>
        <a href="https://zil.ink/taheri_net" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-[#C9A227] px-6 py-2 font-bold text-[#0B3D2E]">
          zil.ink/taheri_net
        </a>
      </div>

      {/* قرار بی‌قرارها */}
      <a href="https://gharaar.net/" target="_blank" rel="noopener noreferrer" className="card-hover mt-6 block rounded-2xl bg-gradient-to-r from-[#0B3D2E] to-[#0E7C7B] p-6 text-center text-white">
        <div className="text-3xl">🚐</div>
        <div className="mt-2 text-lg font-extrabold">قرار بی‌قرارها</div>
        <p className="mt-1 text-sm text-white/80">ثبت‌نام رایگان سفر به عتبات و عالیات</p>
      </a>
    </div>
  );
}
