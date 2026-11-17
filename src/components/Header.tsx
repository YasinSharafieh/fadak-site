"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import ThemeImage from "@/components/ThemeImage";

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

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggle } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 text-white backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-3 py-2.5">
          <Link href="/" className="flex shrink-0 items-center">
            <ThemeImage
              darkSrc="/brand/fadak-wordmark.png"
              lightSrc="/brand/fadak-wordmark-ink.png"
              alt="فدک"
              className="h-11 w-auto object-contain sm:h-14"
            />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <form onSubmit={handleSearch} className="hidden min-[480px]:block">
              <label htmlFor="header-search" className="sr-only">جستجو</label>
              <input
                id="header-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="header-search w-28 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/50 sm:w-36 md:w-44"
              />
            </form>
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 min-[480px]:hidden"
              aria-label="جستجو"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "حالت روز" : "حالت شب"}
              title={theme === "dark" ? "حالت روز" : "حالت شب"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:border-[#c9a227] hover:text-[#c9a227]"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <a
              href="https://noorieh.ir/"
              target="_blank"
              rel="noopener noreferrer"
              title="پایگاه اطلاع‌رسانی نوریه"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-0.5 transition hover:opacity-90"
            >
              <img src="/brand/noorieh-icon.png" alt="" className="h-8 w-8 rounded-md object-contain" />
              <span className="font-noorieh text-[15px] font-bold leading-none">نوریه</span>
            </a>
            <Link href="/donate" className="btn-green hidden rounded-full px-4 py-2 text-sm sm:block">
              کمک به هیئت
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
              aria-label="منو"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3 min-[480px]:hidden">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو..."
              className="w-full max-w-xs rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/50"
              autoFocus
            />
          </form>
        )}

        <nav className="hidden items-center gap-1 border-t border-white/10 py-1.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm hover:bg-white/10 hover:text-[#14a3a2]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {mobileOpen && (
          <nav className="border-t border-white/10 py-4 lg:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm hover:bg-[#0e7c7b] hover:text-white"
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
