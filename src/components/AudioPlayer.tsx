"use client";

import { useRef, useState } from "react";

export default function AudioPlayer({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play();
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow">
      <button
        onClick={toggle}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0B3D2E] text-xl text-[#F7F3E8]"
        aria-label={playing ? "توقف" : "پخش"}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold">{title}</div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F7F3E8]">
          <div
            className="h-full bg-[#C9A227] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <a
        href={src}
        download
        className="shrink-0 rounded-full border px-3 py-1.5 text-xs"
      >
        دانلود
      </a>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress((el.currentTime / el.duration) * 100);
        }}
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
