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
 * محل پلیر (slot) در صفحه — پلیر واقعی در GlobalVideoPlayer (لایه‌اوت) رندر می‌شود
 * و روی همین محل قرار می‌گیرد. این کامپوننت فقط ویدیو را ثبت می‌کند و فضا را نگه می‌دارد.
 * هنگام unmount (تغییر صفحه): اگر مینی‌مالیز نیستیم، پخش متوقف می‌شود.
 */
export default function VideoPlayer({ aparatId, title, thumbnail, videoId }: Props) {
  const { play, close, fullSlotRef, isMinimizedRef, minimized } = useVideoPlayer();
  const slotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    play({ aparatId, title, thumbnail, videoId });
    fullSlotRef.current = slotRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aparatId]);

  // هنگام ترک صفحه: اگر مینی‌مالیز نیستیم، ویدیو را ببند (متوقف شود)
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
      {/* پیام راهنما وقتی پلیر کوچک شده */}
      {minimized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#111]">
          {thumbnail && (
            <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          <p className="relative text-sm text-white/70">ویدیو در پلیر کوچک در حال پخش است</p>
        </div>
      )}
    </div>
  );
}
