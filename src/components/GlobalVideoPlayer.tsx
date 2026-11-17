"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useVideoPlayer } from "@/context/VideoPlayerContext";

/**
 * پلیر سراسری ویدیو — در لایه‌اوت رندر می‌شود.
 * iframe فقط یک‌بار ساخته می‌شود و هرگز جابه‌جا/بازسازی نمی‌شود؛
 * فقط موقعیت/اندازه‌اش با CSS عوض می‌شود → بدون رفرش و بدون ریستارت پخش.
 * - حالت کامل: روی محل پلیر صفحه (slot) قرار می‌گیرد و با اسکرول همگام می‌شود.
 * - حالت مینی: گوشه پایین صفحه.
 */
export default function GlobalVideoPlayer() {
  const { current, minimized, minimize, expand, close, fullSlotRef } = useVideoPlayer();
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const syncPos = useCallback(() => {
    const slot = fullSlotRef.current;
    if (!slot || !document.body.contains(slot)) return;
    const r = slot.getBoundingClientRect();
    setPos({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [fullSlotRef]);

  // موقعیت اولیه پلیر کامل (یک‌بار، بدون همگام‌سازی با اسکرول تا پلیر ثابت بماند)
  useEffect(() => {
    if (minimized || !current) return;
    syncPos();
    const t = setTimeout(syncPos, 150);
    return () => clearTimeout(t);
  }, [minimized, current, syncPos]);

  // توقف پخش هنگام تغییر صفحه (وقتی حالت کامل است و صفحه جدید slot ندارد)
  useEffect(() => {
    if (minimized || !current) return;
    const check = () => {
      const slot = fullSlotRef.current;
      if (!slot || !document.body.contains(slot)) {
        close();
      }
    };
    const t = setTimeout(check, 200);
    return () => clearTimeout(t);
  }, [pathname, minimized, current, fullSlotRef, close]);

  // ریست وضعیت لود هنگام تغییر ویدیو
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [current?.aparatId]);

  if (!current) return null;

  const embedUrl = `https://www.aparat.com/video/video/embed/videohash/${current.aparatId}/vt/frame`;
  const watchUrl = `https://www.aparat.com/v/${current.aparatId}`;

  const containerStyle: React.CSSProperties = minimized
    ? { bottom: 16, right: 16, width: 320 }
    : { top: pos.top, left: pos.left, width: pos.width, height: pos.height };

  return (
    <div
      className="fixed z-50 overflow-hidden rounded-2xl bg-black shadow-2xl"
      style={{ ...containerStyle, transition: "top .35s ease, left .35s ease, width .35s ease, height .35s ease" }}
    >
      {/* ناحیه پخش */}
      <div className="relative aspect-video w-full bg-black">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-4 text-center">
            {current.thumbnail && (
              <img src={current.thumbnail} alt={current.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
            )}
            <div className="relative">
              <div className="text-4xl">🎬</div>
              <p className="mt-2 text-sm font-bold text-white">این ویدیو در آپارات در دسترس نیست</p>
              <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn-green mt-3 inline-block rounded-full px-5 py-1.5 text-xs">
                مشاهده در آپارات
              </a>
            </div>
          </div>
        ) : (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a]">
                {current.thumbnail && (
                  <img src={current.thumbnail} alt={current.title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
                )}
                <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#0e7c7b]" />
                <p className="relative text-sm text-white/60">در حال بارگذاری ویدیو...</p>
              </div>
            )}
            <iframe
              src={embedUrl}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0 h-full w-full"
              title={current.title}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </>
        )}

        {/* دکمه مینی‌مالیز (حالت کامل) */}
        {!minimized && !failed && (
          <button
            onClick={minimize}
            title="کوچک کردن پلیر"
            className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-[#0e7c7b]"
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
      </div>

      {/* نوار کنترل مینی‌پلیر */}
      {minimized && (
        <div className="flex items-center gap-2 border-t border-white/10 bg-[#1a1a1a] px-3 py-2">
          <p className="min-w-0 flex-1 truncate text-xs font-bold text-white">{current.title}</p>
          <button
            onClick={expand}
            title="باز کردن کامل"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#0e7c7b]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
          </button>
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
