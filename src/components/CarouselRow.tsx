"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

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
    const abs = Math.abs(el.scrollLeft);
    setCanPrev(abs > 4);
    setCanNext(abs < max - 4);
  }, []);

  // با هر بار بالا آمدن صفحه، ردیف از اول لیست شروع می‌شود. موقعیت اسکرول ذخیره نمی‌شود.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = 0;
  }, []);

  // به‌روزرسانی وضعیت دکمه‌ها هنگام اسکرول/ریسایز/تغییر محتوا
  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // مشاهده‌گر تغییرات محتوا (وقتی آیتم‌ها لود می‌شن)
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: true });
    const t = setTimeout(update, 400);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mo.disconnect();
      clearTimeout(t);
    };
  }, [update, children]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: -dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const btnBase =
    "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e7c7b] text-white shadow-xl ring-1 ring-white/20 transition hover:bg-[#14a3a2] hover:scale-110 disabled:opacity-0 disabled:pointer-events-none";

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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
}
