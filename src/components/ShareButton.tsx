"use client";

import { useState } from "react";

type Props = {
  title: string;
  /** مسیر صفحه (مثلاً /videos/xxx) — اگر نباشد، آدرس فعلی استفاده می‌شود */
  path?: string;
};

/**
 * دکمه اشتراک‌گذاری:
 * - اگر دستگاه از Web Share API پشتیبانی کند (موبایل)، منوی اشتراک‌گذاری باز می‌شود.
 * - در غیر این صورت لینک در حافظه کپی و پیام «کپی شد» نمایش داده می‌شود.
 */
export default function ShareButton({ title, path }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = path
      ? `${window.location.origin}${path}`
      : window.location.href;

    // Web Share API (موبایل و دستگاه‌های پشتیبان)
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // کاربر لغو کرد یا خطا — ادامه به کپی
      }
    }

    // کپی لینک
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: prompt
      window.prompt("لینک را کپی کنید:", url);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10 transition"
    >
      {copied ? "✅ لینک کپی شد" : "📤 اشتراک‌گذاری"}
    </button>
  );
}
