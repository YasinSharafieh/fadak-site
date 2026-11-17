"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/events", label: "مراسم آینده" },
  { href: "/archive", label: "آرشیو مراسم" },
  { href: "/audio", label: "صوت" },
  { href: "/videos", label: "نماهنگ" },
  { href: "/reels", label: "ریلز" },
  { href: "/gallery", label: "تصویر" },
  { href: "/poems", label: "متن شعر" },
  { href: "/about-heyat", label: "درباره هیئت" },
  { href: "/about-taheri", label: "درباره حسین طاهری" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dc2626] text-xl font-extrabold text-white">ف</div>
            <div>
              <div className="text-lg font-extrabold leading-none">فدک</div>
              <div className="text-[10px] text-white/60">حفظ و نشر آثار کربلایی حسین طاهری</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm hover:bg-white/10 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/search" className="rounded-full p-2 hover:bg-white/10 transition" title="جستجو">
              🔍
            </Link>
            <Link href="/donate" className="btn-red hidden sm:block rounded-full px-5 py-2 text-sm">
              کمک به هیئت
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 hover:bg-white/10 transition lg:hidden"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/10 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-white/20 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
