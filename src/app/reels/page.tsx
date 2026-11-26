"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { shareLink } from "@/components/ShareButton";
import SectionSkeleton from "@/components/SectionSkeleton";
import { toPersianDigits } from "@/lib/jalali";

type Reel = {
  id: string;
  title: string;
  video_url: string;
  cover_url?: string | null;
  duration?: string | null;
  created_at?: string;
};

type Engage = { count: number; liked: boolean; saved: boolean };

const SEEN_KEY = "fadak-reels-seen";
const MUTE_KEY = "fadak-reels-muted";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ratioFromRight(clientX: number, rect: DOMRect) {
  if (rect.width <= 0) return 0;
  return clamp((rect.right - clientX) / rect.width, 0, 1);
}

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.floor(seconds);
  return toPersianDigits(`${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`);
}

function readSeen() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]") as string[]);
  } catch {
    return new Set<string>();
  }
}

export default function ReelsPage() {
  const pathname = usePathname();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [engage, setEngage] = useState<Record<string, Engage>>({});
  const [copiedId, setCopiedId] = useState("");
  const [heart, setHeart] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const tapRef = useRef(0);
  const seeking = useRef(false);

  const stopAll = useCallback(() => {
    videoRefs.current.forEach((video) => video?.pause());
  }, []);

  useEffect(() => {
    let gone = false;
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
      if (gone) return;
      const rows = (data || []) as Reel[];
      setReels(rows);
      const hash = window.location.hash.replace("#", "");
      const hashed = rows.findIndex((reel) => reel.id === hash);
      if (hashed >= 0) setIndex(hashed);
      else {
        const seen = readSeen();
        const unseen = rows.findIndex((reel) => !seen.has(reel.id));
        setIndex(unseen >= 0 ? unseen : 0);
      }
      setLoading(false);
    }
    load();
    return () => {
      gone = true;
    };
  }, []);

  useEffect(() => {
    try {
      setMuted(sessionStorage.getItem(MUTE_KEY) !== "0");
    } catch {
      /* نشست در دسترس نیست */
    }
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;
    const keys = reels.map((reel) => `reel:${reel.id}`).join(",");
    fetch(`/api/engage?keys=${encodeURIComponent(keys)}`)
      .then((res) => res.json())
      .then((data) => {
        const next: Record<string, Engage> = {};
        reels.forEach((reel) => {
          const mine = data.mine?.[`reel:${reel.id}`];
          next[reel.id] = {
            count: data.counts?.[`reel:${reel.id}`] || 0,
            liked: Boolean(mine?.liked),
            saved: Boolean(mine?.saved),
          };
        });
        setEngage(next);
      })
      .catch(() => {});
  }, [reels]);

  useEffect(() => {
    const onHide = () => stopAll();
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      stopAll();
    };
  }, [stopAll]);

  useEffect(() => {
    return () => stopAll();
  }, [pathname, stopAll]);

  useEffect(() => {
    const root = stageRef.current;
    if (!root || reels.length === 0) return;
    const nodes = videoRefs.current.filter(Boolean) as HTMLVideoElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const at = Number(video.dataset.index || 0);
          if (entry.isIntersecting && entry.intersectionRatio >= 0.72) {
            setIndex(at);
            if (!seeking.current) video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0.72] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [reels]);

  useEffect(() => {
    videoRefs.current.forEach((video, at) => {
      if (!video) return;
      video.muted = muted;
      if (at === index && !paused) video.play().catch(() => {});
      if (at !== index) video.pause();
    });
  }, [muted, index, paused, reels]);

  useEffect(() => {
    const reel = reels[index];
    const node = stageRef.current?.querySelector(`[data-reel-slide="${index}"]`);
    node?.scrollIntoView({ block: "start" });
    if (reel) {
      const seen = readSeen();
      seen.add(reel.id);
      try {
        sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
      } catch {
        /* مهم نیست */
      }
    }
  }, [index, reels]);

  function go(delta: number) {
    const next = clamp(index + delta, 0, reels.length - 1);
    setPaused(false);
    setIndex(next);
    stageRef.current?.querySelector(`[data-reel-slide="${next}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function act(id: string, action: "like" | "save") {
    const reel = reels.find((item) => item.id === id);
    const res = await fetch("/api/engage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reel",
        id,
        action,
        title: reel?.title || "ریلز",
        href: `/reels#${id}`,
        thumb: reel?.cover_url || "",
      }),
    });
    if (res.status === 401) {
      window.location.href = `/login?next=${encodeURIComponent(`/reels#${id}`)}`;
      return null;
    }
    if (!res.ok) return null;
    const data = await res.json();
    const next = { count: data.count || 0, liked: Boolean(data.liked), saved: Boolean(data.saved) };
    setEngage((prev) => ({ ...prev, [id]: next }));
    return next;
  }

  function burst(id: string) {
    setHeart(id);
    window.setTimeout(() => setHeart((current) => (current === id ? null : current)), 700);
  }

  function onStagePointer(id: string) {
    const now = Date.now();
    if (now - tapRef.current < 280) {
      tapRef.current = 0;
      burst(id);
      if (!engage[id]?.liked) act(id, "like");
      return;
    }
    tapRef.current = now;
    window.setTimeout(() => {
      if (Date.now() - tapRef.current < 260) return;
      tapRef.current = 0;
      const video = videoRefs.current[index];
      if (!video) return;
      if (video.paused) {
        setPaused(false);
        video.play().catch(() => {});
      } else {
        setPaused(true);
        video.pause();
      }
    }, 280);
  }

  function toggleMute() {
    setMuted((current) => {
      const next = !current;
      try {
        sessionStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* مهم نیست */
      }
      return next;
    });
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowUp" || event.key === "ArrowRight") {
        event.preventDefault();
        go(-1);
      } else if (event.key === " ") {
        event.preventDefault();
        onStagePointer(reels[index]?.id || "");
      } else if (event.key === "m" || event.key === "M") {
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (loading) {
    return (
      <div className="reels-container bg-black text-white">
        <SectionSkeleton kind="reel" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="reels-container flex items-center justify-center bg-black px-6 text-center text-white">
        <p className="text-sm text-white/60">هنوز ریلزی ثبت نشده.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      <div ref={stageRef} className="reels-container snap-y snap-mandatory overflow-y-auto bg-black">
        {reels.map((reel, at) => {
          const state = engage[reel.id] || { count: 0, liked: false, saved: false };
          const active = at === index;
          return (
            <section
              key={reel.id}
              id={reel.id}
              data-reel-slide={at}
              className="reel-item relative flex snap-start items-center justify-center bg-black"
            >
              <div className="relative flex h-full w-full max-w-[460px] items-center justify-center">
                <div className="relative h-[min(100%,860px)] w-full overflow-hidden bg-black sm:rounded-[28px] sm:ring-1 sm:ring-[#14a3a2]/30">
                  <video
                    ref={(el) => {
                      videoRefs.current[at] = el;
                    }}
                    data-index={at}
                    data-reel="1"
                    src={reel.video_url}
                    poster={reel.cover_url || undefined}
                    className="h-full w-full bg-black object-contain"
                    loop
                    muted={muted}
                    playsInline
                    preload={Math.abs(at - index) <= 1 ? "auto" : "metadata"}
                    onTimeUpdate={(event) => {
                      if (!active || seeking.current) return;
                      const el = event.currentTarget;
                      const length = Number.isFinite(el.duration) ? el.duration : 0;
                      setDuration(length);
                      setCurrentTime(el.currentTime || 0);
                      setProgress(length ? (el.currentTime / length) * 100 : 0);
                    }}
                    onClick={() => onStagePointer(reel.id)}
                  />

                  <div className="pointer-events-none absolute inset-x-3 top-3 flex gap-1" dir="rtl">
                    {reels.map((item, seg) => (
                      <span key={item.id} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
                        <span
                          className="block h-full bg-[#14a3a2]"
                          style={{ width: seg < index ? "100%" : seg === index ? `${progress}%` : "0%" }}
                        />
                      </span>
                    ))}
                  </div>

                  {heart === reel.id && (
                    <span className="reel-heart-pop pointer-events-none absolute left-1/2 top-1/2 text-6xl text-[#14a3a2]">♥</span>
                  )}

                  {paused && active && (
                    <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white">
                      <PlayIcon />
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="absolute left-3 top-8 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"
                    aria-label={muted ? "روشن کردن صدا" : "قطع صدا"}
                  >
                    {muted ? "صدا خاموش" : "صدا روشن"}
                  </button>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-4 pb-4 pt-16">
                    <SeekBar
                      progress={active ? progress : 0}
                      disabled={!active || !duration}
                      onSeek={(ratio) => {
                        const video = videoRefs.current[at];
                        if (!video || !Number.isFinite(video.duration)) return;
                        seeking.current = false;
                        video.currentTime = ratio * video.duration;
                        setCurrentTime(video.currentTime);
                        setProgress(ratio * 100);
                      }}
                      onDrag={(ratio) => {
                        seeking.current = true;
                        setProgress(ratio * 100);
                        if (duration) setCurrentTime(ratio * duration);
                      }}
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-white/70" dir="rtl">
                      <span>گذشته {clock(active ? currentTime : 0)}</span>
                      <span>کل {active && duration ? clock(duration) : toPersianDigits(reel.duration || "—")}</span>
                    </div>
                    <p className="mt-2 text-base font-extrabold text-white">{reel.title}</p>
                    <p className="mt-1 text-xs text-white/70">کربلایی حسین طاهری · ریلز اینستاگرام</p>
                  </div>
                </div>

                <div className="absolute bottom-28 left-3 flex flex-col items-center gap-3 sm:static sm:bottom-auto sm:left-auto sm:mr-3">
                  <RailButton
                    label="لایک"
                    count={toPersianDigits(state.count)}
                    active={state.liked}
                    onClick={() => act(reel.id, "like")}
                  >
                    <HeartIcon filled={state.liked} />
                  </RailButton>
                  <RailButton label={state.saved ? "حذف از علاقه‌مندی" : "ذخیره"} active={state.saved} onClick={() => act(reel.id, "save")}>
                    <SaveIcon filled={state.saved} />
                  </RailButton>
                  <RailButton
                    label={copiedId === reel.id ? "کپی شد" : "اشتراک"}
                    onClick={async () => {
                      const result = await shareLink(reel.title, `/reels#${reel.id}`);
                      if (result === "copied") {
                        setCopiedId(reel.id);
                        window.setTimeout(() => setCopiedId(""), 1800);
                      }
                    }}
                  >
                    <ShareIcon />
                  </RailButton>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto hidden max-w-3xl items-center justify-between px-2 md:flex">
        <button type="button" onClick={() => go(1)} disabled={index === reels.length - 1} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b] text-white disabled:opacity-30" aria-label="ریلز بعدی">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b] text-white disabled:opacity-30" aria-label="ریلز قبلی">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 15 6-6 6 6" /></svg>
        </button>
      </div>
    </div>
  );
}

function SeekBar({
  progress,
  disabled,
  onSeek,
  onDrag,
}: {
  progress: number;
  disabled?: boolean;
  onSeek: (ratio: number) => void;
  onDrag: (ratio: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="relative h-6 cursor-pointer"
      dir="ltr"
      onPointerDown={(event) => {
        if (disabled || !ref.current) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        onDrag(ratioFromRight(event.clientX, ref.current.getBoundingClientRect()));
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId) || !ref.current) return;
        onDrag(ratioFromRight(event.clientX, ref.current.getBoundingClientRect()));
      }}
      onPointerUp={(event) => {
        if (!ref.current) return;
        onSeek(ratioFromRight(event.clientX, ref.current.getBoundingClientRect()));
      }}
      role="slider"
      aria-label="جابه‌جایی در ریلز، از راست به چپ"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/20">
        <span className="absolute inset-y-0 right-0 bg-[#14a3a2]" style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}

function RailButton({
  label,
  count,
  active,
  onClick,
  children,
}: {
  label: string;
  count?: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex flex-col items-center gap-1 text-white">
      <span className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur ${active ? "border-[#14a3a2] bg-[#0e7c7b] text-white" : "border-white/15 bg-black/40 text-white"}`}>
        {children}
      </span>
      <span className="text-[10px] font-bold">{count || label}</span>
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
    </svg>
  );
}

function SaveIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
