"use client";

import { useEffect, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  src: string;
  eventTitle?: string;
};

type Props = {
  tracks: Track[];
  onClose?: () => void;
};

export default function FadakPlayer({ tracks, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      // ادامه پخش از محل قبلی
      const saved = localStorage.getItem(`fadak-progress-${currentTrack.id}`);
      if (saved) {
        audio.currentTime = parseFloat(saved);
      }
    };

    const handleEnded = () => {
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, currentTrack.id, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      // ذخیره محل پخش
      localStorage.setItem(`fadak-progress-${currentTrack.id}`, audio.currentTime.toString());
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B3D2E] text-[#F7F3E8] shadow-2xl">
      <audio ref={audioRef} />
      
      {/* نوار پیشرفت */}
      <div className="h-1 bg-white/20 cursor-pointer" onClick={seek}>
        <div className="h-full bg-[#C9A227] transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-4">
          {/* دکمه‌های پخش */}
          <div className="flex items-center gap-2">
            <button onClick={playPrev} disabled={currentIndex === 0} className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30 transition">
              ⏮
            </button>
            <button onClick={togglePlay} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] text-xl text-[#0B3D2E] hover:scale-105 transition">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={playNext} disabled={currentIndex === tracks.length - 1} className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30 transition">
              ⏭
            </button>
          </div>

          {/* اطلاعات آهنگ */}
          <div className="flex-1 min-w-0">
            <div className="truncate font-bold">{currentTrack.title}</div>
            <div className="text-xs text-white/60">
              {formatTime(currentTime)} / {formatTime(duration)} • {currentIndex + 1} از {tracks.length}
            </div>
          </div>

          {/* کنترل‌ها */}
          <div className="flex items-center gap-2">
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="rounded-lg bg-white/10 px-2 py-1 text-sm"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>

            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 accent-[#C9A227]"
            />

            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="rounded-full p-2 hover:bg-white/10 transition"
              title="پلی‌لیست"
            >
              📋
            </button>

            {onClose && (
              <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10 transition">
                ✕
              </button>
            )}
          </div>
        </div>

        {/* پلی‌لیست */}
        {showPlaylist && (
          <div className="mt-3 max-h-48 overflow-y-auto rounded-xl bg-white/10 p-2">
            {tracks.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right transition ${
                  idx === currentIndex ? "bg-[#C9A227] text-[#0B3D2E]" : "hover:bg-white/10"
                }`}
              >
                <span className="text-sm">{idx === currentIndex ? "▶" : idx + 1}</span>
                <span className="flex-1 truncate text-sm">{track.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
