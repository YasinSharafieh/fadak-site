"use client";

import { useEffect, useRef } from "react";
import { useVideoPlayer } from "@/context/VideoPlayerContext";

type Props = {
  aparatId: string;
  title: string;
  thumbnail?: string;
  videoId?: string;
};

/**
 * محل پلیر در صفحه (slot).
 * پلیر واقعی در GlobalVideoPlayer رندر می‌شود و دقیقاً روی این slot قرار می‌گیرد؛
 * با اسکرول صفحه، همراهش حرکت می‌کند (مثل یک المان عادی صفحه).
 * وقتی مینی‌مالیز است، این slot پیام «در حال پخش در پلیر کوچک» را نشان می‌دهد.
 */
export default function VideoPlayer({ aparatId, title, thumbnail, videoId }: Props) {
  const { play, expand, minimized, fullSlotRef, isMinimizedRef, close } = useVideoPlayer();
  const slotRef = useRef<HTMLDivElement | null>(null);

  // ثبت ویدیو و slot هنگام mount
  useEffect(() => {
    play({ aparatId, title, thumbnail, videoId });
    fullSlotRef.current = slotRef.current;
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

  return (
    <div ref={slotRef} className="relative aspect-video w-full bg-black">
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
    </div>
  );
}
