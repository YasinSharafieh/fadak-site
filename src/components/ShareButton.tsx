"use client";

import { useState } from "react";

type Props = {
  title: string;
  /** مسیر صفحه (مثلاً /videos/xxx) — اگر نباشد، آدرس فعلی استفاده می‌شود */
  path?: string;
  compact?: boolean;
};

/**
 * دکمه اشتراک‌گذاری:
 * - اگر دستگاه از Web Share API پشتیبانی کند (موبایل)، منوی اشتراک‌گذاری باز می‌شود.
 * - در غیر این صورت لینک در حافظه کپی و پیام «کپی شد» نمایش داده می‌شود.
 */
export async function shareLink(title: string, path?: string) {
  const url = path ? `${window.location.origin}${path}` : window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, text: title, url });
      return "shared" as const;
    } catch {
      // کاربر لغو کرد یا دستگاه منو ندارد
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  } catch {
    window.prompt("لینک را کپی کنید:", url);
    return "prompt" as const;
  }
}

export default function ShareButton({ title, path, compact }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const result = await shareLink(title, path);
    if (result === "copied") {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "لینک کپی شد" : "اشتراک‌گذاری"}
        title={copied ? "لینک کپی شد" : "اشتراک‌گذاری"}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
          copied
            ? "border-[#14a3a2] bg-[#0e7c7b] text-white"
            : "border-white/15 bg-black/30 text-white/75 hover:border-[#14a3a2] hover:text-[#14a3a2]"
        }`}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
            <path d="M5 12.5 9.2 17 19 7" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10 transition"
    >
      {copied ? "لینک کپی شد" : "اشتراک‌گذاری"}
    </button>
  );
}
