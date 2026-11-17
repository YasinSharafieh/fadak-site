"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoPlayer } from "@/context/VideoPlayerContext";

type Props = {
  aparatId: string;
  title: string;
  thumbnail?: string;
  videoId?: string;
};

/**
 * پلیر ویدیوی آپارات — داخل صفحه (inline) در جای صحیح خودش.
 * ساختار: slot (محل پلیر) > wrapper (قابل جابه‌جایی، حاوی iframe)
 * - minimize: wrapper به مینی‌پلیر منتقل می‌شود (پخش قطع نمی‌شود)
 * - expand: wrapper به slot برمی‌گردد
 * - unmount بدون minimize: پخش متوقف می‌شود
 */
export default function VideoPlayer({ aparatId, title, thumbnail, videoId }: Props) {
  const { play, minimize, expand, minimized, iframeWrapperRef, fullSlotRef, isMinimizedRef, close } = useVideoPlayer();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const embedUrl = `https://www.aparat.com/video/video/embed/videohash/${aparatId}/vt/frame`;
  const watchUrl = `https://www.aparat.com/v/${aparatId}`;

  // ثبت ویدیو و رفرنس‌ها هنگام mount
  useEffect(() => {
    play({ aparatId, title, thumbnail, videoId });
    fullSlotRef.current = slotRef.current;
    iframeWrapperRef.current = wrapperRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aparatId]);

  // هنگام ترک صفحه: اگر مینی‌مالیز نیستیم، پخش را متوقف کن
  useEffect(() => {
    return () => {
      if (!isMinimizedRef.current) {
        close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-6 text-center">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative">
          <div className="text-5xl">🎬</div>
          <p className="mt-3 font-bold text-white">این ویدیو در حال حاضر در آپارات در دسترس نیست</p>
          <p className="mt-1 text-sm text-white/70">ممکن است حذف یا خصوصی شده باشد.</p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green mt-4 inline-block rounded-full px-6 py-2 text-sm"
          >
            مشاهده در آپارات
          </a>
        </div>
      </div>
    );
  }

  return (
    <div ref={slotRef} className="relative aspect-video w-full bg-black">
      {/* پیام راهنما وقتی پلیر کوچک شده */}
      {minimized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111]">
          {thumbnail && (
            <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          <p className="relative text-sm text-white/70">ویدیو در پلیر کوچک در حال پخش است</p>
          <button onClick={expand} className="btn-green relative rounded-full px-5 py-2 text-sm">
            ⛶ باز کردن کامل
          </button>
        </div>
      )}

      {/* wrapper قابل جابه‌جایی */}
      <div ref={wrapperRef} className="absolute inset-0">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a]">
            {thumbnail && (
              <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
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
          title={title}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>

      {/* دکمه مینی‌مالیز */}
      {!minimized && (
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
  );
}
