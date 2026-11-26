"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { shareLink } from "@/components/ShareButton";
import { rememberEngage } from "@/components/EngageBar";
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

const MUTE_KEY = "fadak-reels-muted";
const HINT_KEY = "fadak-reels-hint";
const NAV_START = "fadak-reels-from-nav";

function takeNavStart() {
  try {
    if (sessionStorage.getItem(NAV_START) !== "1") return false;
    sessionStorage.removeItem(NAV_START);
    return true;
  } catch {
    return false;
  }
}
const INSTAGRAM = "https://www.instagram.com/hoseintaheri_official/";

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

function paint(stage: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const height = stage.clientHeight || 1;
  const box = stage.getBoundingClientRect();
  stage.querySelectorAll<HTMLElement>("[data-reel-card]").forEach((card) => {
    const slide = card.closest<HTMLElement>("[data-reel-slide]");
    if (!slide) return;
    const dist = (slide.getBoundingClientRect().top - box.top) / height;
    const abs = Math.min(Math.abs(dist), 1);
    card.style.transform = `scale(${1 - abs * 0.075})`;
    card.style.opacity = String(1 - abs * 0.38);
  });
}

export default function ReelsPage() {
  const pathname = usePathname();
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [engage, setEngage] = useState<Record<string, Engage>>({});
  const [copiedId, setCopiedId] = useState("");
  const [heart, setHeart] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [edge, setEdge] = useState("");
  const [hint, setHint] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const indexRef = useRef(0);
  const countRef = useRef(0);
  const moving = useRef(false);
  const seeking = useRef(false);
  const lastTap = useRef(0);
  const playingBeforeTap = useRef(false);
  const placed = useRef(false);
  const left = useRef(false);
  const silenceRef = useRef<(hard?: boolean) => void>(() => {});
  const goRef = useRef<(delta: number) => void>(() => {});
  const seekRef = useRef<(seconds: number) => void>(() => {});
  const toggleRef = useRef<() => void>(() => {});
  const muteRef = useRef<() => void>(() => {});

  const collectVideos = useCallback(() => {
    const nodes = new Set<HTMLVideoElement>();
    videoRefs.current.forEach((video) => {
      if (video) nodes.add(video);
    });
    document.querySelectorAll(".reels-shell video, video[data-reel]").forEach((node) => {
      if (node instanceof HTMLVideoElement) nodes.add(node);
    });
    return nodes;
  }, []);

  const silence = useCallback((hard = false) => {
    left.current = true;
    collectVideos().forEach((video) => {
      try {
        video.pause();
      } catch {
        /* عنصر در حال جمع شدن است */
      }
      if (!hard) return;
      video.removeAttribute("src");
      video.querySelectorAll("source").forEach((source) => source.remove());
      try {
        video.load();
      } catch {
        /* منبع همین حالا برداشته شده */
      }
    });
  }, [collectVideos]);
  silenceRef.current = silence;

  useLayoutEffect(() => {
    document.documentElement.classList.add("reels-open");
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (anchor instanceof HTMLAnchorElement && isLeavingLink(anchor)) silenceRef.current(false);
    };
    const onLeave = () => silenceRef.current(false);
    document.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", onLeave);
    window.addEventListener("popstate", onLeave);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("popstate", onLeave);
      document.documentElement.classList.remove("reels-open");
      silenceRef.current(true);
    };
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
      let startMuted = true;
      try {
        startMuted = sessionStorage.getItem(MUTE_KEY) !== "0";
        if (sessionStorage.getItem(HINT_KEY) !== "1" && rows.length > 1) {
          const fine = window.matchMedia("(pointer: fine)").matches;
          setHint(fine ? "برای ریلز بعدی اسکرول کنید" : "برای ریلز بعدی به بالا بکشید");
        }
      } catch {
        /* نشست در دسترس نیست */
      }
      setMuted(startMuted);
      setReels(rows);
      countRef.current = rows.length;
      setLoading(false);
    }
    load();
    return () => {
      gone = true;
    };
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
        reels.forEach((reel) => rememberEngage("reel", reel.id, next[reel.id]));
      })
      .catch(() => {});
  }, [reels]);

  const place = useCallback((at: number, behavior: ScrollBehavior) => {
    const el = stageRef.current;
    if (!el) return;
    const jump = () => el.scrollTo({ top: at * el.clientHeight, behavior });
    jump();
    requestAnimationFrame(jump);
  }, []);

  const restartFromNewest = useCallback(() => {
    takeNavStart();
    indexRef.current = 0;
    setIndex(0);
    setPaused(false);
    moving.current = true;
    place(0, "auto");
    const stage = stageRef.current;
    if (stage) paint(stage);
    if (window.location.pathname === "/reels" && window.location.hash) {
      history.replaceState(null, "", "/reels");
    }
    window.setTimeout(() => {
      moving.current = false;
    }, 80);
  }, [place]);

  useEffect(() => {
    const onStart = () => {
      if (!countRef.current) return;
      restartFromNewest();
    };
    window.addEventListener("fadak-reels-from-start", onStart);
    return () => window.removeEventListener("fadak-reels-from-start", onStart);
  }, [restartFromNewest]);

  useLayoutEffect(() => {
    if (!reels.length || placed.current) return;
    placed.current = true;
    const fromNav = takeNavStart();
    const hash = fromNav ? "" : window.location.hash.replace("#", "");
    if (fromNav && window.location.hash) history.replaceState(null, "", "/reels");
    const hashed = reels.findIndex((reel) => reel.id === hash);
    const start = hashed >= 0 ? hashed : 0;
    indexRef.current = start;
    setIndex(start);
    place(start, "auto");
    const stage = stageRef.current;
    if (stage) paint(stage);
  }, [reels, place]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => {
      stage.scrollTo({ top: indexRef.current * stage.clientHeight, behavior: "auto" });
      paint(stage);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [reels.length]);

  function dismissHint() {
    setHint("");
    try {
      sessionStorage.setItem(HINT_KEY, "1");
    } catch {
      /* مهم نیست */
    }
  }

  function flashEdge(dir: number) {
    setEdge(dir > 0 ? "آخرین ریلز" : "اولین ریلز");
    window.setTimeout(() => setEdge(""), 900);
  }

  function go(delta: number) {
    const count = countRef.current;
    if (count === 0) return;
    const next = clamp(indexRef.current + delta, 0, count - 1);
    if (next === indexRef.current) {
      flashEdge(delta);
      return;
    }
    dismissHint();
    indexRef.current = next;
    setIndex(next);
    setPaused(false);
    moving.current = true;
    place(next, "smooth");
    window.setTimeout(() => {
      moving.current = false;
    }, 720);
  }

  function seekBy(seconds: number) {
    const video = videoRefs.current[indexRef.current];
    if (!video || !Number.isFinite(video.duration)) return;
    seeking.current = true;
    video.currentTime = clamp(video.currentTime + seconds, 0, Math.max(0, video.duration - 0.05));
    setCurrentTime(video.currentTime);
    setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0);
    window.setTimeout(() => {
      seeking.current = false;
    }, 80);
  }

  function togglePlay() {
    const video = videoRefs.current[indexRef.current];
    if (!video) return;
    if (video.paused) {
      left.current = false;
      setPaused(false);
      video.play().catch(() => {});
    } else {
      setPaused(true);
      video.pause();
    }
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

  goRef.current = go;
  seekRef.current = seekBy;
  toggleRef.current = togglePlay;
  muteRef.current = toggleMute;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || reels.length === 0) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let lockedUntil = 0;
    let pending = 0;
    let pendingTimer = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = Date.now();
      if (now < lockedUntil) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? shell.clientHeight : 1;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.4) return;
      pending += event.deltaY * unit;
      window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(() => {
        pending = 0;
      }, 160);
      if (Math.abs(pending) < 36) return;
      const dir = pending > 0 ? 1 : -1;
      pending = 0;
      lockedUntil = now + 680;
      goRef.current(dir);
    };
    shell.addEventListener("wheel", onWheel, { passive: false });
    return () => shell.removeEventListener("wheel", onWheel);
  }, [reels.length]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const done = () => {
      moving.current = false;
      const height = stage.clientHeight;
      if (!height) return;
      const next = clamp(Math.round(stage.scrollTop / height), 0, Math.max(0, countRef.current - 1));
      const target = next * height;
      if (Math.abs(stage.scrollTop - target) > 3) stage.scrollTo({ top: target, behavior: "auto" });
    };
    stage.addEventListener("scrollend", done);
    return () => stage.removeEventListener("scrollend", done);
  }, [reels.length]);

  useEffect(() => {
    if (left.current) {
      silence(true);
      return;
    }
    videoRefs.current.forEach((video, at) => {
      if (!video) return;
      video.muted = muted;
      if (at !== index || paused) {
        video.pause();
        return;
      }
      video.play().then(() => {
        if (!left.current) return;
        video.pause();
        video.removeAttribute("src");
        try {
          video.load();
        } catch {
          /* خروج از صفحه منبع را بسته است */
        }
      }).catch(() => {
        if (left.current) return;
        if (!video.muted) {
          video.muted = true;
          setMuted(true);
          video.play().catch(() => setPaused(true));
          return;
        }
        setPaused(true);
      });
    });
    return () => {
      videoRefs.current.forEach((video) => video?.pause());
    };
  }, [index, muted, paused, reels.length, silence]);

  useEffect(() => {
    const reel = reels[index];
    if (!reel) return;
    const url = `/reels#${reel.id}`;
    if (`${window.location.pathname}${window.location.hash}` !== url) {
      history.replaceState(null, "", url);
    }
  }, [index, reels]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a, input, textarea, [role='slider']")) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        goRef.current(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        goRef.current(-1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        seekRef.current(10);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        seekRef.current(-10);
      } else if (event.key === " ") {
        event.preventDefault();
        toggleRef.current();
      } else if (event.key === "m" || event.key === "M") {
        event.preventDefault();
        muteRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onHide = () => {
      if (document.hidden) collectVideos().forEach((video) => video.pause());
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [collectVideos]);

  useLayoutEffect(() => {
    return () => silenceRef.current(true);
  }, [pathname]);

  function onStageScroll() {
    const stage = stageRef.current;
    if (!stage) return;
    paint(stage);
    if (moving.current) return;
    const next = clamp(Math.round(stage.scrollTop / Math.max(stage.clientHeight, 1)), 0, Math.max(0, countRef.current - 1));
    if (next !== indexRef.current) {
      indexRef.current = next;
      setIndex(next);
      setPaused(false);
      dismissHint();
    }
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
    rememberEngage("reel", id, next);
    return next;
  }

  function onVideoClick(id: string) {
    const now = performance.now();
    const gap = now - lastTap.current;
    lastTap.current = now;
    const video = videoRefs.current[indexRef.current];
    if (!video) return;
    if (gap < 280) {
      if (!engage[id]?.liked) act(id, "like");
      setHeart(id);
      window.setTimeout(() => setHeart((current) => (current === id ? null : current)), 700);
      if (playingBeforeTap.current) {
        setPaused(false);
        video.play().catch(() => {});
      }
      return;
    }
    playingBeforeTap.current = !video.paused;
    togglePlay();
  }

  if (loading) {
    return (
      <div className="reels-shell">
        <SectionSkeleton kind="reel" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="reels-shell flex items-center justify-center px-6 text-center">
        <p className="text-sm text-white/60">هنوز ریلزی ثبت نشده.</p>
      </div>
    );
  }

  const active = reels[index];

  return (
    <div ref={shellRef} className="reels-shell relative select-none">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {reels.map((reel, at) =>
          reel.cover_url ? (
            <img
              key={reel.id}
              src={reel.cover_url}
              alt=""
              className={`absolute inset-0 h-full w-full scale-110 object-cover blur-3xl transition-opacity duration-700 ${at === index ? "opacity-50" : "opacity-0"}`}
            />
          ) : null
        )}
        <div className="reel-veil absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/75" />
      </div>

      <div ref={stageRef} className="reels-stage relative z-10" onScroll={onStageScroll}>
        {reels.map((reel, at) => {
          const state = engage[reel.id] || { count: 0, liked: false, saved: false };
          const live = at === index;
          return (
            <section key={reel.id} id={reel.id} data-reel-slide={at} className="reel-slide flex items-center justify-center">
              <div className="flex h-full w-full items-end justify-center gap-3 sm:items-center sm:px-4">
                <div
                  data-reel-card
                  data-active={live ? "true" : "false"}
                  className="reel-card"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[at] = el;
                    }}
                    src={reel.video_url}
                    poster={reel.cover_url || undefined}
                    className="reel-frame h-full w-full bg-black object-cover"
                    data-reel="1"
                    loop
                    muted={muted}
                    playsInline
                    preload={at === index || at === index + 1 ? "auto" : "metadata"}
                    onClick={() => onVideoClick(reel.id)}
                    onWaiting={() => live && setBuffering(true)}
                    onPlaying={() => live && setBuffering(false)}
                    onCanPlay={() => live && setBuffering(false)}
                    onTimeUpdate={(event) => {
                      if (!live || seeking.current) return;
                      const el = event.currentTarget;
                      const length = Number.isFinite(el.duration) ? el.duration : 0;
                      setDuration(length);
                      setCurrentTime(el.currentTime || 0);
                      setProgress(length ? (el.currentTime / length) * 100 : 0);
                    }}
                  />

                  {heart === reel.id && (
                    <span className="reel-heart-pop pointer-events-none absolute left-1/2 top-1/2 text-7xl text-[#e8c766]">♥</span>
                  )}
                  {paused && live && (
                    <span className="on-media pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white">
                      <PlayIcon />
                    </span>
                  )}
                  {buffering && live && !paused && (
                    <span className="pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/25 border-t-[#14a3a2]" />
                  )}

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="on-media absolute left-3 top-3 z-10 flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-2.5 text-white backdrop-blur"
                    aria-label={muted ? "روشن کردن صدا" : "قطع صدا"}
                  >
                    {muted ? <MuteIcon /> : <SoundIcon />}
                    {muted && <span className="pe-1 text-[11px] font-bold">صدا</span>}
                  </button>

                  <div className="on-media pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-4 pb-4 pt-20 pe-16 sm:pe-4">
                    <div className="pointer-events-auto">
                      <SeekBar
                        progress={live ? progress : 0}
                        disabled={!live || !duration}
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
                          const video = videoRefs.current[at];
                          if (video && Number.isFinite(video.duration)) {
                            video.currentTime = ratio * video.duration;
                            setCurrentTime(video.currentTime);
                          }
                          setProgress(ratio * 100);
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-white/70" dir="rtl">
                      <span>گذشته {clock(live ? currentTime : 0)}</span>
                      <span>مانده {live && duration ? clock(Math.max(0, duration - currentTime)) : toPersianDigits(reel.duration || "—")}</span>
                    </div>
                    <p className="mt-2 text-lg font-extrabold leading-7 text-white">{reel.title}</p>
                    <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-1 inline-flex items-center gap-1.5 text-xs text-white/80">
                      <img src="/brand/platforms/instagram.png" alt="" className="h-4 w-4 rounded-sm" />
                      کربلایی حسین طاهری
                    </a>
                  </div>

                  <div className="on-media absolute bottom-28 left-3 z-10 flex flex-col items-center gap-3 sm:hidden">
                    <Rail state={state} copied={copiedId === reel.id} onLike={() => act(reel.id, "like")} onSave={() => act(reel.id, "save")} onShare={() => shareReel(reel, setCopiedId)} />
                  </div>
                </div>

                <div className="mb-[4%] hidden shrink-0 flex-col items-center gap-3 self-end sm:flex">
                  <Rail state={state} copied={copiedId === reel.id} onLike={() => act(reel.id, "like")} onSave={() => act(reel.id, "save")} onShare={() => shareReel(reel, setCopiedId)} />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-3 z-20 hidden flex-col items-center justify-center gap-3 md:flex">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b] text-white shadow-lg disabled:opacity-30" aria-label="ریلز قبلی">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <button type="button" onClick={() => go(1)} disabled={index === reels.length - 1} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b] text-white shadow-lg disabled:opacity-30" aria-label="ریلز بعدی">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
        <span className="on-media rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
          {toPersianDigits(index + 1)} از {toPersianDigits(reels.length)}
          {active ? <span className="sr-only"> {active.title}</span> : null}
        </span>
      </div>

      {edge && <div className="reel-edge on-media pointer-events-none absolute left-1/2 top-12 z-30 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">{edge}</div>}
      {hint && index === 0 && (
        <div className="pointer-events-none absolute inset-x-0 top-12 z-30 flex justify-center">
          <span className="on-media rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
            <span className="reel-hint-chevron me-1 inline-block">↑</span>
            {hint}
          </span>
        </div>
      )}
    </div>
  );
}

async function shareReel(reel: Reel, setCopied: (id: string) => void) {
  const result = await shareLink(reel.title, `/reels#${reel.id}`);
  if (result === "copied") {
    setCopied(reel.id);
    window.setTimeout(() => setCopied(""), 1600);
  }
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
        event.stopPropagation();
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
      onClick={(event) => event.stopPropagation()}
      role="slider"
      aria-label="جابه‌جایی در ریلز، از راست به چپ"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
        <span className="absolute inset-y-0 right-0 bg-[#14a3a2]" style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}

function Rail({
  state,
  copied,
  onLike,
  onSave,
  onShare,
}: {
  state: Engage;
  copied: boolean;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
}) {
  return (
    <>
      <RailButton label="لایک" count={toPersianDigits(state.count)} active={state.liked} gold onClick={onLike}>
        <HeartIcon filled={state.liked} />
      </RailButton>
      <RailButton label={state.saved ? "حذف از علاقه‌مندی" : "ذخیره"} active={state.saved} onClick={onSave}>
        <SaveIcon filled={state.saved} />
      </RailButton>
      <RailButton label={copied ? "کپی شد" : "اشتراک"} onClick={onShare}>
        <ShareIcon />
      </RailButton>
    </>
  );
}

function RailButton({
  label,
  count,
  active,
  gold,
  onClick,
  children,
}: {
  label: string;
  count?: string;
  active?: boolean;
  gold?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const on = active
    ? gold
      ? "border-[#c9a227] bg-[#c9a227] text-black"
      : "border-[#14a3a2] bg-[#0e7c7b] text-white"
    : "border-white/15 bg-black/45 text-white";
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="flex flex-col items-center gap-1 text-white">
      <span className={`on-media flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur ${on}`}>{children}</span>
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

function SoundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}
