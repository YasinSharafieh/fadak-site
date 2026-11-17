"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useVideoPlayer } from "@/context/VideoPlayerContext";

/**
 * پلیر سراسری — یک iframe واحد که هرگز در DOM جابه‌جا یا بازسازی نمی‌شود.
 *
 * - حالت کامل: دقیقاً روی slot در صفحه قرار می‌گیرد و با اسکرول صفحه
 *   همراهش حرکت می‌کند (مثل یک المان عادی صفحه — بدون هیچ پرش یا جابه‌جایی عجیب).
 * - حالت مینی: گوشه پایین صفحه ثابت می‌ماند.
 *
 * کوچک/بزرگ کردن فقط position را عوض می‌کند → پخش بدون هیچ وقفه،
 * بدون رفرش و بدون از اول شروع شدن ادامه می‌یابد.
 */
export default function GlobalVideoPlayer() {
  const { current, minimized, expand, minimize, close, fullSlotRef } = useVideoPlayer();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // ریست وضعیت لود با تغییر ویدیو
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [current?.aparatId]);

  // همگام‌سازی موقعیت با slot در حالت کامل — با اسکرول و ری‌سایز همراهش حرکت می‌کند
  useEffect(() => {
    if (!current || minimized) return;
    let rafId = 0;
    const sync = () => {
      const container = containerRef.current;
      const slot = fullSlotRef.current;
      if (container && slot) {
        const rect = slot.getBoundingClientRect();
        container.style.top = `${rect.top}px`;
        container.style.left = `${rect.left}px`;
        container.style.width = `${rect.width}px`;
        container.style.height = `${rect.height}px`;
      }
      rafId = requestAnimationFrame(sync);
    };
    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [current, minimized, fullSlotRef]);

  // هنگام ورود به حالت مینی: پاک کردن inline styleهای حالت کامل
  // تا کلاس‌های مینی‌پلیر (bottom/right/width) بدون مانع اعمال شوند
  useEffect(() => {
    if (minimized && containerRef.current) {
      const c = containerRef.current;
      c.style.top = "";
      c.style.left = "";
      c.style.width = "";
      c.style.height = "";
    }
  }, [minimized]);

  // توقف پخش هنگام ناوبری در حالت کامل (صفحه جدید slot ندارد)
  useEffect(() => {
    if (!minimized && current && !fullSlotRef.current) {
      close();
    }
  }, [pathname, minimized, current, close, fullSlotRef]);

  if (!current) return null;

  const embedUrl = `https://www.aparat.com/video/video/embed/videohash/${current.aparatId}/vt/frame`;
  const watchUrl = `https://www.aparat.com/v/${current.aparatId}`;

  return (
    <div
      ref={containerRef}
      className={
        minimized
          ? "fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
          : "fixed z-40 bg-black"
      }
      style={minimized ? undefined : { top: 0, left: 0 }}
    >
      <div className="relative aspect-video w-full">
        {!loaded && !failed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a]">
            {current.thumbnail && (
              <img src={current.thumbnail} alt={current.title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
            )}
            <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#0e7c7b]" />
            <p className="relative text-sm text-white/60">در حال بارگذاری ویدیو...</p>
          </div>
        )}

        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-6 text-center">
            <div className="text-4xl">🎬</div>
            <p className="font-bold text-white">این ویدیو در حال حاضر در دسترس نیست</p>
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn-green rounded-full px-5 py-2 text-sm">
              مشاهده در آپارات
            </a>
          </div>
        ) : (
          <iframe
            key={current.aparatId}
            src={embedUrl}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="absolute inset-0 h-full w-full"
            title={current.title}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}

        {/* دکمه مینی‌مالیز در حالت کامل */}
        {!minimized && !failed && (
          <button
            onClick={minimize}
            title="کوچک کردن پلیر"
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-3.5 py-2 text-xs font-bold text-white shadow-lg backdrop-blur transition hover:bg-[#0e7c7b]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3" />
              <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
              <path d="M3 16h3a2 2 0 0 1 2 2v3" />
              <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
            </svg>
            کوچک کردن
          </button>
        )}

        {/* دکمه بستن روی گوشه ویدیوی کوچیک‌شده */}
        {minimized && !failed && (
          <button
            onClick={close}
            title="بستن ویدیو"
            className="absolute left-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/85 text-white shadow-lg backdrop-blur transition hover:bg-red-600"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* نوار کنترل مینی‌پلیر */}
      {minimized && (
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
      )}
    </div>
  );
}
