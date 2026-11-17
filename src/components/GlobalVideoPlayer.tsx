"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useVideoPlayer } from "@/context/VideoPlayerContext";

/**
 * مینی‌پلیر سراسری — در لایه‌اوت رندر می‌شود و با تغییر صفحه باقی می‌ماند.
 * iframe بین slot پلیر کامل و slot مینی‌پلیر جابه‌جا می‌شود (بدون قطع پخش).
 */
export default function GlobalVideoPlayer() {
  const { current, minimized, expand, close, iframeWrapperRef, miniSlotRef, fullSlotRef } = useVideoPlayer();

  // جابه‌جایی iframe بین پلیر کامل و مینی‌پلیر بدون قطع پخش
  useEffect(() => {
    const wrapper = iframeWrapperRef.current;
    if (!wrapper) return;

    if (minimized) {
      if (miniSlotRef.current && wrapper.parentNode !== miniSlotRef.current) {
        miniSlotRef.current.appendChild(wrapper);
      }
    } else {
      const fullSlot = fullSlotRef.current;
      if (fullSlot && document.body.contains(fullSlot) && wrapper.parentNode !== fullSlot) {
        fullSlot.appendChild(wrapper);
      }
    }
  }, [minimized, current, iframeWrapperRef, miniSlotRef, fullSlotRef]);

  if (!current || !minimized) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl sm:left-auto sm:right-4 sm:w-80">
      {/* محل قرارگیری iframe */}
      <div ref={miniSlotRef} className="relative aspect-video w-full bg-black" />

      {/* نوار کنترل مینی‌پلیر */}
      <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2">
        <p className="min-w-0 flex-1 truncate text-xs font-bold text-white">{current.title}</p>
        {current.videoId && (
          <Link
            href={`/videos/${current.videoId}`}
            onClick={expand}
            title="باز کردن کامل"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#0e7c7b]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </Link>
        )}
        <button
          onClick={close}
          title="بستن پلیر"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-red-600"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
