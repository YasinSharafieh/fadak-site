"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import ThemeImage from "@/components/ThemeImage";
import TodayDates from "@/components/TodayDates";

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
  const [accountName, setAccountName] = useState<string | null>(null);
  const { theme, toggle } = useTheme();
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setAccountName(data.user ? data.user.name || "حساب من" : null))
      .catch(() => setAccountName(null));
  }, []);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const apply = () => {
      document.documentElement.style.setProperty("--site-header-h", `${node.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mobileOpen, searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header
      ref={headerRef}
      data-menu-open={mobileOpen || searchOpen ? "true" : "false"}
      className="site-header sticky top-0 z-40 border-b border-white/10 bg-black text-white"
    >
      <TodayDates />
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
              <div className="relative">
                <input
                  id="header-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجو..."
                  className="header-search w-32 rounded-full border border-white/15 bg-white/10 py-1.5 pe-8 ps-3 text-xs text-white outline-none placeholder:text-white/50 sm:w-40 md:w-48"
                />
                <button type="submit" aria-label="جستجو" title="جستجو" className="absolute end-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#14a3a2] transition hover:bg-[#0e7c7b] hover:text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </button>
              </div>
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
            <Link
              href={accountName ? "/account" : "/login"}
              title={accountName ? "حساب من" : "ورود"}
              className="flex h-9 items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 text-xs font-bold transition hover:border-[#c9a227] hover:text-[#c9a227]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 19.2a7 7 0 0 1 14 0" />
              </svg>
              <span className="hidden sm:inline">{accountName || "ورود"}</span>
            </Link>
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
              className="flex shrink-0 items-center transition hover:opacity-90"
            >
              <ThemeImage
                darkSrc="/brand/noorieh-logo.png"
                lightSrc="/brand/noorieh-logo-ink.png"
                alt="نوریه"
                className="h-9 w-auto object-contain sm:h-10"
              />
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
            <div className="relative max-w-xs">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full rounded-full border border-white/15 bg-white/10 py-2 pe-10 ps-4 text-sm text-white placeholder:text-white/50"
                autoFocus
              />
              <button type="submit" aria-label="جستجو" title="جستجو" className="absolute end-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#14a3a2] transition hover:bg-[#0e7c7b] hover:text-white">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
              </button>
            </div>
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
