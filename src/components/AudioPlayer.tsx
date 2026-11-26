"use client";

import { useEffect, useId, useRef, useState } from "react";
import EngageBar from "@/components/EngageBar";
import { toPersianDigits } from "@/lib/jalali";

const CLAIM = "fadak-audio-claim";
const SPEEDS = [1, 1.25, 1.5, 2, 0.75] as const;

function finiteDuration(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.floor(seconds);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const text =
    h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${m}:${String(s).padStart(2, "0")}`;
  return toPersianDigits(text);
}

function bufferedEnd(el: HTMLAudioElement) {
  try {
    if (!el.buffered.length) return 0;
    return el.buffered.end(el.buffered.length - 1);
  } catch {
    return 0;
  }
}

export default function AudioPlayer({
  title,
  src,
  id,
  href = "/audio",
}: {
  title: string;
  src: string;
  id?: string;
  href?: string;
}) {
  const reactId = useId();
  const owner = id || reactId;
  const audioRef = useRef<HTMLAudioElement>(null);
  const seeking = useRef(false);
  const [dragging, setDragging] = useState(false);
  const skipRef = useRef<(delta: number) => void>(() => {});
  const seekToRef = useRef<(time: number) => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);

  const remaining = duration ? Math.max(0, duration - currentTime) : 0;
  const progress = duration ? Math.min(100, (currentTime / duration) * 100) : 0;
  const bufferedPct = duration ? Math.min(100, (buffered / duration) * 100) : 0;

  function read(el: HTMLAudioElement) {
    const nextDuration = finiteDuration(el.duration);
    if (nextDuration) setDuration(nextDuration);
    if (!seeking.current) setCurrentTime(el.currentTime || 0);
    setBuffered(bufferedEnd(el));
  }

  function recoverDuration(el: HTMLAudioElement) {
    if (el.duration !== Number.POSITIVE_INFINITY) return;
    const fix = () => {
      el.removeEventListener("timeupdate", fix);
      const found = finiteDuration(el.duration);
      try {
        el.currentTime = 0;
      } catch {
        /* هنوز قابل جابه‌جایی نیست */
      }
      if (found) setDuration(found);
    };
    el.addEventListener("timeupdate", fix);
    try {
      el.currentTime = 1e101;
    } catch {
      el.removeEventListener("timeupdate", fix);
    }
  }

  function seekTo(time: number) {
    const el = audioRef.current;
    if (!el) return;
    const limit = finiteDuration(el.duration) || duration;
    const next = Math.min(limit || time, Math.max(0, time));
    seeking.current = false;
    try {
      el.currentTime = next;
    } catch {
      return;
    }
    setCurrentTime(next);
  }

  function skip(delta: number) {
    const el = audioRef.current;
    seekTo((el?.currentTime || currentTime) + delta);
  }

  skipRef.current = skip;
  seekToRef.current = seekTo;

  function claim() {
    window.dispatchEvent(new CustomEvent(CLAIM, { detail: owner }));
  }

  function bindSession(el: HTMLAudioElement) {
    const session = navigator.mediaSession;
    if (!session) return;
    try {
      session.metadata = new MediaMetadata({ title });
      session.playbackState = el.paused ? "paused" : "playing";
      session.setActionHandler("play", () => {
        el.play().catch(() => {});
      });
      session.setActionHandler("pause", () => el.pause());
      session.setActionHandler("seekbackward", () => skipRef.current(-10));
      session.setActionHandler("seekforward", () => skipRef.current(10));
      session.setActionHandler("seekto", (details) => {
        if (details.seekTime != null) seekToRef.current(details.seekTime);
      });
    } catch {
      /* بعضی مرورگرها همهٔ فرمان‌ها را ندارند */
    }
  }

  useEffect(() => {
    const onClaim = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      const el = audioRef.current;
      if (!el || detail === owner || el.paused) return;
      el.pause();
    };
    window.addEventListener(CLAIM, onClaim);
    return () => window.removeEventListener(CLAIM, onClaim);
  }, [owner]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    setPlaying(false);
    setFailed(false);
    setDuration(0);
    setCurrentTime(0);
    setBuffered(0);
    setBuffering(false);
  }, [src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      claim();
      el.play().catch(() => setFailed(true));
    } else {
      el.pause();
    }
  };

  const cycleSpeed = () => {
    const index = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    const next = SPEEDS[(index + 1) % SPEEDS.length] ?? 1;
    setSpeed(next);
    const el = audioRef.current;
    if (el) el.playbackRate = next;
  };

  return (
    <div className="rounded-2xl bg-[#1a1a1a] p-4 shadow" role="group" aria-label={title}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b3d2e] text-[#F7F3E8]"
          aria-label={playing ? "توقف" : "پخش"}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="font-bold leading-7">{title}</div>

          <div dir="ltr" className="mt-3">
            <div className="relative h-10 min-w-0">
              <div className="fadak-seek-rail pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full">
                <div className="fadak-seek-buffer absolute inset-y-0 left-0" style={{ width: `${bufferedPct}%` }} />
                <div className="absolute inset-y-0 left-0 bg-[#0e7c7b]" style={{ width: `${progress}%` }} />
              </div>
              {dragging && duration > 0 && (
                <span
                  className="pointer-events-none absolute -top-5 z-10 -translate-x-1/2 rounded-full bg-[#0b3d2e] px-2 py-0.5 text-[10px] font-bold text-[#F7F3E8]"
                  style={{ left: `${progress}%` }}
                >
                  {formatClock(currentTime)}
                </span>
              )}
              <input
                type="range"
                className="fadak-seek absolute inset-0"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                disabled={!duration || failed}
                aria-label="جابه‌جایی در صوت"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={`گذشته ${formatClock(currentTime)} از کل ${formatClock(duration)}، مانده ${formatClock(remaining)}`}
                onPointerDown={() => {
                  seeking.current = true;
                  setDragging(true);
                }}
                onPointerUp={(e) => {
                  seekTo(Number(e.currentTarget.value));
                  setDragging(false);
                }}
                onPointerCancel={() => {
                  seeking.current = false;
                  setDragging(false);
                }}
                onBlur={() => {
                  seeking.current = false;
                  setDragging(false);
                }}
                onInput={(e) => {
                  seeking.current = true;
                  setDragging(true);
                  setCurrentTime(Number(e.currentTarget.value));
                }}
                onChange={(e) => {
                  seekTo(Number(e.currentTarget.value));
                  setDragging(false);
                }}
              />
            </div>

          </div>

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => skip(-10)}
              disabled={failed}
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-white/15 text-xs font-bold text-white/80 transition hover:border-[#14a3a2] hover:text-[#14a3a2] disabled:opacity-40"
              aria-label="ده ثانیه عقب"
            >
              <span>عقب</span>
              <span>۱۰ ثانیه</span>
            </button>
            <button
              type="button"
              onClick={() => skip(10)}
              disabled={failed}
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-white/15 text-xs font-bold text-white/80 transition hover:border-[#14a3a2] hover:text-[#14a3a2] disabled:opacity-40"
              aria-label="ده ثانیه جلو"
            >
              <span>جلو</span>
              <span>۱۰ ثانیه</span>
            </button>
          </div>

          <div dir="ltr" className="mt-1 grid grid-cols-3 gap-1.5 text-center">
            <TimeReadout label="گذشته" value={duration || currentTime ? formatClock(currentTime) : "—"} pulse={!duration && !failed} />
            <TimeReadout label="مانده" value={duration ? formatClock(remaining) : "—"} pulse={!duration && !failed} />
            <TimeReadout label="کل" value={duration ? formatClock(duration) : "—"} pulse={!duration && !failed} />
          </div>
          {(buffering || failed) && (
            <p className="mt-1.5 text-center text-[11px] text-white/55" aria-live="polite">
              {failed ? "این صوت باز نشد. دانلود هنوز هست." : "در حال بارگذاری صوت…"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {id && <EngageBar type="audio" id={id} title={title} href={href} compact />}
          <button
            type="button"
            onClick={cycleSpeed}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
              speed === 1 ? "border-white/15 text-white/80" : "border-[#c9a227] fadak-speed-on"
            }`}
            aria-label={`سرعت پخش ${toPersianDigits(speed)} برابر`}
          >
            سرعت {toPersianDigits(speed)}×
          </button>
        </div>
        <a href={src} download className="shrink-0 rounded-full border px-3 py-1.5 text-xs">
          دانلود
        </a>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          read(e.currentTarget);
          recoverDuration(e.currentTarget);
        }}
        onDurationChange={(e) => read(e.currentTarget)}
        onTimeUpdate={(e) => read(e.currentTarget)}
        onProgress={(e) => read(e.currentTarget)}
        onWaiting={() => setBuffering(true)}
        onPlaying={(e) => {
          setBuffering(false);
          setPlaying(true);
          setFailed(false);
          bindSession(e.currentTarget);
        }}
        onCanPlay={() => setBuffering(false)}
        onPlay={(e) => {
          claim();
          setPlaying(true);
          bindSession(e.currentTarget);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setBuffering(false);
        }}
        onError={() => {
          setFailed(true);
          setBuffering(false);
        }}
      />
    </div>
  );
}

function TimeReadout({ label, value, pulse }: { label: string; value: string; pulse?: boolean }) {
  return (
    <div className="rounded-xl bg-[#111111] px-1 py-1.5">
      <div className="text-[10px] text-white/55">{label}</div>
      <div className={`mt-0.5 text-sm font-extrabold tabular-nums text-[#14a3a2] ${pulse ? "animate-pulse" : ""}`}>{value}</div>
    </div>
  );
}
