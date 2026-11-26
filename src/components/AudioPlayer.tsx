"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import EngageBar from "@/components/EngageBar";
import { toPersianDigits } from "@/lib/jalali";

const CLAIM = "fadak-audio-claim";
const SPEEDS = [1, 1.25, 1.5, 2, 0.75] as const;
const SKIP = 10;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** نسبت از لبهٔ راست. صفر یعنی ابتدای صوت، یک یعنی پایان. */
function ratioFromRight(clientX: number, rect: DOMRect) {
  if (rect.width <= 0) return 0;
  return clamp((rect.right - clientX) / rect.width, 0, 1);
}

function isLeavingLink(anchor: HTMLAnchorElement) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href") || "";
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
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
  const pathname = usePathname();
  const reactId = useId();
  const owner = id || reactId;
  const audioRef = useRef<HTMLAudioElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const seeking = useRef(false);
  const skipRef = useRef<(delta: number) => void>(() => {});
  const seekToRef = useRef<(time: number) => void>(() => {});
  const haltRef = useRef<(hard?: boolean) => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [dragging, setDragging] = useState(false);

  const remaining = duration ? Math.max(0, duration - currentTime) : 0;
  const progress = duration ? clamp((currentTime / duration) * 100, 0, 100) : 0;
  const bufferedPct = duration ? clamp((buffered / duration) * 100, 0, 100) : 0;

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

  function halt(hard = false) {
    const el = audioRef.current;
    seeking.current = false;
    setDragging(false);
    setPlaying(false);
    setBuffering(false);
    if (!el) return;
    el.pause();
    if (hard) {
      el.removeAttribute("src");
      try {
        el.load();
      } catch {
        /* عنصر در حال جمع شدن است */
      }
    }
    try {
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "none";
    } catch {
      /* مرورگر سشن رسانه ندارد */
    }
  }

  haltRef.current = halt;

  function seekTo(time: number) {
    const el = audioRef.current;
    if (!el) return;
    const limit = finiteDuration(el.duration) || duration;
    const next = clamp(time, 0, limit || time);
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
      session.playbackState = "playing";
      session.setActionHandler("play", () => {
        el.play().catch(() => {});
      });
      session.setActionHandler("pause", () => el.pause());
      session.setActionHandler("seekbackward", () => skipRef.current(-SKIP));
      session.setActionHandler("seekforward", () => skipRef.current(SKIP));
      session.setActionHandler("seekto", (details) => {
        if (details.seekTime != null) seekToRef.current(details.seekTime);
      });
    } catch {
      /* بعضی مرورگرها همهٔ فرمان‌ها را ندارند */
    }
  }

  function previewAt(clientX: number) {
    const rail = railRef.current;
    if (!rail || !duration) return;
    const time = ratioFromRight(clientX, rail.getBoundingClientRect()) * duration;
    seeking.current = true;
    setDragging(true);
    setCurrentTime(time);
  }

  function commitAt(clientX: number) {
    const rail = railRef.current;
    if (!rail || !duration) return;
    seekTo(ratioFromRight(clientX, rail.getBoundingClientRect()) * duration);
    setDragging(false);
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

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (anchor instanceof HTMLAnchorElement && isLeavingLink(anchor)) haltRef.current(false);
    };
    const onPageHide = () => haltRef.current(false);
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("popstate", onPageHide);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("popstate", onPageHide);
      haltRef.current(true);
    };
  }, []);

  useEffect(() => {
    return () => haltRef.current(false);
  }, [pathname]);

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

  const onKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;
    const step = event.shiftKey ? 30 : SKIP;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      skip(step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      skip(-step);
    } else if (event.key === "Home") {
      event.preventDefault();
      seekTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      seekTo(duration);
    }
  };

  return (
    <div dir="rtl" className="rounded-2xl bg-[#1a1a1a] p-4 shadow" role="group" aria-label={title}>
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

          <div className="mt-3 flex items-center gap-2">
            <SkipButton way="back" disabled={failed} onClick={() => skip(-SKIP)} />

            <div
              ref={railRef}
              className="relative h-11 min-w-0 flex-1 cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#14a3a2]/70"
              role="slider"
              tabIndex={duration && !failed ? 0 : -1}
              aria-label="جابه‌جایی در صوت، از راست به چپ"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              aria-valuetext={`گذشته ${formatClock(currentTime)} از کل ${formatClock(duration)}، مانده ${formatClock(remaining)}`}
              aria-disabled={!duration || failed}
              onKeyDown={onKey}
              onPointerDown={(event) => {
                if (!duration || failed) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                previewAt(event.clientX);
              }}
              onPointerMove={(event) => {
                if (!seeking.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
                previewAt(event.clientX);
              }}
              onPointerUp={(event) => {
                if (!duration || failed) return;
                commitAt(event.clientX);
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
              }}
              onPointerCancel={() => {
                seeking.current = false;
                setDragging(false);
              }}
            >
              <div className="fadak-seek-rail pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full">
                <div className="fadak-seek-buffer absolute inset-y-0 right-0" style={{ width: `${bufferedPct}%` }} />
                <div className="absolute inset-y-0 right-0 bg-[#0e7c7b]" style={{ width: `${progress}%` }} />
              </div>
              <span
                className="fadak-seek-thumb pointer-events-none absolute top-1/2"
                style={{ right: `calc(${progress}% - 9px)` }}
              />
              {dragging && duration > 0 && (
                <span
                  className="keep-contrast pointer-events-none absolute -top-1 z-10 rounded-full bg-[#0b3d2e] px-2 py-0.5 text-[10px] font-bold text-[#F7F3E8]"
                  style={{ right: `${progress}%`, transform: "translate(50%, -100%)" }}
                >
                  {formatClock(currentTime)}
                </span>
              )}
            </div>

            <SkipButton way="forward" disabled={failed} onClick={() => skip(SKIP)} />
          </div>

          <div className="mt-1 grid grid-cols-3 gap-1.5 text-center">
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
              speed === 1 ? "border-white/15 text-white/80" : "border-[#14a3a2] text-[#14a3a2]"
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

function SkipButton({
  way,
  disabled,
  onClick,
}: {
  way: "forward" | "back";
  disabled?: boolean;
  onClick: () => void;
}) {
  const forward = way === "forward";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={forward ? "ده ثانیه جلو" : "ده ثانیه عقب"}
      aria-label={forward ? "ده ثانیه جلو" : "ده ثانیه عقب"}
      className="inline-flex h-11 shrink-0 items-center justify-center gap-1 rounded-full border border-[#0e7c7b]/45 bg-[#0b3d2e]/50 px-2.5 text-[#14a3a2] transition hover:border-[#14a3a2] hover:bg-[#0e7c7b] hover:text-[#F7F3E8] disabled:opacity-40"
    >
      <span className="inline-flex items-center gap-0.5" dir="ltr">
        {forward && <Arrow dir="left" />}
        <span className="text-[13px] font-extrabold tabular-nums leading-none">{toPersianDigits(SKIP)}</span>
        {!forward && <Arrow dir="right" />}
      </span>
    </button>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === "left" ? (
        <>
          <path d="M15 6 9 12l6 6" />
          <path d="M19 12H9" />
        </>
      ) : (
        <>
          <path d="m9 6 6 6-6 6" />
          <path d="M5 12h10" />
        </>
      )}
    </svg>
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
