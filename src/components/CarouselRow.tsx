"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * ردیف اسکرول‌دار با دکمه‌های قبلی/بعدی — برای همه بخش‌های افقی صفحه اصلی.
 * در چیدمان RTL: دکمه چپ = بعدی (محتوای بیشتر)، دکمه راست = قبلی.
 */
export default function CarouselRow({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // در RTL مرورگرها: scrollLeft از 0 تا منفی (کروم) یا از max تا 0 (سافاری)
    const sl = el.scrollLeft;
    const abs = Math.abs(sl);
    setCanPrev(abs > 4);
    setCanNext(abs < max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const t = setTimeout(update, 300);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // dir=1 → بعدی (اسکرول به چپ در RTL)، dir=-1 → قبلی
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const btnBase =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur transition hover:bg-[#0e7c7b] disabled:opacity-0 disabled:pointer-events-none";

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`flex gap-3 overflow-x-auto pb-3 no-scrollbar scroll-smooth ${className}`}
      >
        {children}
      </div>

      {/* دکمه قبلی (راست) */}
      <button
        onClick={() => scroll(-1)}
        disabled={!canPrev}
        aria-label="قبلی"
        className={`${btnBase} right-2`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* دکمه بعدی (چپ) */}
      <button
        onClick={() => scroll(1)}
        disabled={!canNext}
        aria-label="بعدی"
        className={`${btnBase} left-2`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
}
