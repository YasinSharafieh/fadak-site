"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode, type MutableRefObject } from "react";

export type CurrentVideo = {
  aparatId: string;
  title: string;
  thumbnail?: string;
  videoId?: string; // شناسه دیتابیسی برای ناوبری به صفحه جزئیات
};

type VideoPlayerContextType = {
  current: CurrentVideo | null;
  minimized: boolean;
  /** رفرنس به محل پلیر کامل در صفحه (slot) — برای همگام‌سازی موقعیت پلیر سراسری */
  fullSlotRef: MutableRefObject<HTMLDivElement | null>;
  play: (video: CurrentVideo) => void;
  minimize: () => void;
  expand: () => void;
  close: () => void;
  /** برای بررسی در cleanup — آیا الان مینی‌مالیزه؟ */
  isMinimizedRef: MutableRefObject<boolean>;
};

const VideoPlayerContext = createContext<VideoPlayerContextType | null>(null);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<CurrentVideo | null>(null);
  const [minimized, setMinimized] = useState(false);
  const isMinimizedRef = useRef(false);
  const fullSlotRef = useRef<HTMLDivElement | null>(null);

  const play = useCallback((video: CurrentVideo) => {
    setCurrent(video);
    setMinimized(false);
    isMinimizedRef.current = false;
  }, []);

  const minimize = useCallback(() => {
    setMinimized(true);
    isMinimizedRef.current = true;
  }, []);

  const expand = useCallback(() => {
    setMinimized(false);
    isMinimizedRef.current = false;
  }, []);

  const close = useCallback(() => {
    setCurrent(null);
    setMinimized(false);
    isMinimizedRef.current = false;
  }, []);

  return (
    <VideoPlayerContext.Provider
      value={{
        current,
        minimized,
        fullSlotRef,
        play,
        minimize,
        expand,
        close,
        isMinimizedRef,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const ctx = useContext(VideoPlayerContext);
  if (!ctx) throw new Error("useVideoPlayer must be used within VideoPlayerProvider");
  return ctx;
}
