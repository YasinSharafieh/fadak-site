"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_MS = 700;
const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

function isInternalNavigation(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  if (url.pathname === pathname && url.search === window.location.search) return false;
  return true;
}

/** لودینگ صفحات: نشان فدک، نام فدک، حلقه و نوار سبز. بعد از آماده شدن صفحه بسته می‌شود. */
export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(14);
  const started = useRef(0);
  const hideTimer = useRef<number | null>(null);

  const clearHide = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const show = () => {
    clearHide();
    started.current = Date.now();
    setProgress(14);
    setVisible(true);
  };

  useEffect(() => {
    if (!started.current) started.current = Date.now();
  }, []);

  const scheduleHide = () => {
    clearHide();
    if (!started.current) started.current = Date.now();
    const wait = Math.max(0, MIN_MS - (Date.now() - started.current));
    hideTimer.current = window.setTimeout(() => {
      setProgress(100);
      hideTimer.current = window.setTimeout(() => setVisible(false), 260);
    }, wait);
  };

  useEffect(() => {
    scheduleHide();
    return clearHide;
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const tick = window.setInterval(() => {
      setProgress((value) => (value >= 90 ? value : Math.min(90, value + 5 + Math.random() * 6)));
    }, 160);
    const safety = window.setTimeout(() => setVisible(false), 8000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(safety);
    };
  }, [visible]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || !isInternalNavigation(anchor, pathname)) return;
      show();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  if (!visible) return null;

  const offset = RING_C - (Math.min(progress, 100) / 100) * RING_C;

  return (
    <div
      className="page-loader fixed inset-0 z-[70] flex items-center justify-center bg-[#0a0a0a]"
      role="status"
      aria-live="polite"
      aria-label="در حال آماده‌سازی صفحه"
    >
      <div className="flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="page-loader-glow absolute inset-8 rounded-full bg-[#0e7c7b]/40 blur-2xl" />
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            <circle className="page-loader-ring" cx="60" cy="60" r={RING_R} fill="none" stroke="rgba(14,124,123,0.28)" strokeWidth="2.5" />
            <circle
              cx="60"
              cy="60"
              r={RING_R}
              fill="none"
              stroke="#14a3a2"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={offset}
            />
          </svg>
          <img
            src="/brand/fadak-mark.png"
            alt=""
            className="relative h-[4.5rem] w-[4.5rem] drop-shadow-[0_0_18px_rgba(20,163,162,0.9)]"
          />
        </div>
        <p className="page-loader-title mt-1 text-xl font-extrabold text-white">فدک</p>
        <p className="page-loader-sub mt-1 text-xs text-white/55">در حال آماده‌سازی صفحه</p>
        <div className="page-loader-track mt-4 h-1 w-28 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#14a3a2] transition-[width] duration-200" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
