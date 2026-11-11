import Link from "next/link";

const nav = [
  { href: "/", label: "خانه" },
  { href: "/events", label: "مراسم آینده" },
  { href: "/archive", label: "آرشیو مراسم" },
  { href: "/audio", label: "صوت" },
  { href: "/gallery", label: "تصویر" },
  { href: "/videos", label: "نماهنگ" },
  { href: "/poems", label: "متن شعر" },
  { href: "/reels", label: "ریلز" },
  { href: "/about-heyat", label: "درباره هیئت" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0B3D2E] text-[#F7F3E8] shadow-lg">
      <div className="islamic-pattern-dark">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A227] bg-[#0E7C7B] text-xl font-bold text-[#F7F3E8]">
              ف
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold">فدک</div>
              <div className="text-[11px] text-[#C9A227]">حفظ و نشر آثار کربلایی حسین طاهری</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm hover:bg-white/10 hover:text-[#C9A227]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="rounded-full border border-[#C9A227]/60 px-4 py-2 text-sm hover:bg-[#C9A227] hover:text-[#0B3D2E]"
            >
              جستجو
            </Link>
            <Link
              href="/donate"
              className="hidden rounded-full bg-[#C9A227] px-4 py-2 text-sm font-bold text-[#0B3D2E] hover:bg-[#b8911f] sm:block"
            >
              کمک به هیئت
            </Link>
          </div>
        </div>
        {/* نوار موبایل */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full bg-white/10 px-3 py-1.5 text-xs"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
