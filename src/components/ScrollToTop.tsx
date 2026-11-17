"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * با هر تغییر صفحه، اسکرولر به بالای بالا برمی‌گردد.
 * همچنین بازیابی خودکار اسکرول مرورگر (دکمه برگشت) را غیرفعال می‌کند
 * تا در همه صفحات، شروع از بالای صفحه باشد.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // غیرفعال کردن بازیابی اسکرول مرورگر
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // چند بار تکرار می‌شود تا بر بازیابی اسکرول Next.js غلبه کند
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    const raf = requestAnimationFrame(toTop);
    const t = window.setTimeout(toTop, 50);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
