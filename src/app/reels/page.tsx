"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Reel = {
  id: string;
  title: string;
  file_url: string;
  thumbnail?: string;
  likes?: number;
  event_id?: string;
};

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data } = await supabase.from("reels").select("*").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setReels(data);
        } else {
          // داده نمونه
          setReels([
            { id: "1", title: "شور | یوحنا", file_url: "", thumbnail: "" },
            { id: "2", title: "مناجات با امام زمان", file_url: "", thumbnail: "" },
            { id: "3", title: "زمینه | قرارمونو بهم نزن", file_url: "", thumbnail: "" },
          ]);
        }
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (reels.length === 0) return;
    const keys = reels.map((reel) => `reel:${reel.id}`).join(",");
    fetch(`/api/engage?keys=${encodeURIComponent(keys)}`)
      .then((res) => res.json())
      .then((data) => {
        const likedNext = new Set<string>();
        const savedNext = new Set<string>();
        reels.forEach((reel) => {
          const mine = data.mine?.[`reel:${reel.id}`];
          if (mine?.liked) likedNext.add(reel.id);
          if (mine?.saved) savedNext.add(reel.id);
        });
        setLiked(likedNext);
        setSaved(savedNext);
      })
      .catch(() => {});
  }, [reels]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            const idx = parseInt(video.dataset.index || "0");
            setCurrentIndex(idx);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels]);

  const toggleLike = async (id: string) => {
    const res = await fetch("/api/engage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reel", id, action: "like", title: reels.find((reel) => reel.id === id)?.title || "ریلز", href: "/reels" }),
    });
    if (res.status === 401) {
      window.location.href = "/login?next=/reels";
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setLiked((prev) => {
      const next = new Set(prev);
      if (data.liked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSave = async (id: string) => {
    const res = await fetch("/api/engage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reel", id, action: "save", title: reels.find((reel) => reel.id === id)?.title || "ریلز", href: "/reels" }),
    });
    if (res.status === 401) {
      window.location.href = "/login?next=/reels";
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setSaved((prev) => {
      const next = new Set(prev);
      if (data.saved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  if (reels.length === 0) {
    return (
      <div className="reels-container flex items-center justify-center bg-black text-white">
        <p>در حال بارگذاری ریلزها...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="reels-container bg-black">
      {reels.map((reel, idx) => (
        <div key={reel.id} className="reel-item relative flex items-center justify-center">
          <div className="relative h-full w-full max-w-md bg-black">
            {reel.file_url ? (
              <video
                ref={(el) => { videoRefs.current[idx] = el; }}
                data-index={idx}
                src={reel.file_url}
                className="h-full w-full object-cover"
                loop
                muted={muted}
                playsInline
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#0B3D2E] to-black text-white">
                <div className="text-center">
                  <div className="text-6xl">▶</div>
                  <p className="mt-4 text-lg font-bold">{reel.title}</p>
                  <p className="mt-2 text-sm text-white/60">ریلز فدک</p>
                </div>
              </div>
            )}

            {/* کنترل‌های سمت راست */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
              <button
                onClick={() => toggleLike(reel.id)}
                className={`flex flex-col items-center gap-1 transition ${liked.has(reel.id) ? "text-red-500" : "text-white"}`}
              >
                <span className="text-3xl">{liked.has(reel.id) ? "❤️" : "🤍"}</span>
                <span className="text-xs">لایک</span>
              </button>

              <button
                onClick={() => toggleSave(reel.id)}
                className={`flex flex-col items-center gap-1 transition ${saved.has(reel.id) ? "text-[#C9A227]" : "text-white"}`}
              >
                <span className="text-3xl">{saved.has(reel.id) ? "🔖" : "📑"}</span>
                <span className="text-xs">ذخیره</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-white">
                <span className="text-3xl">💬</span>
                <span className="text-xs">نظر</span>
              </button>

              <button className="flex flex-col items-center gap-1 text-white">
                <span className="text-3xl">↗️</span>
                <span className="text-xs">اشتراک</span>
              </button>
            </div>

            {/* اطلاعات پایین */}
            <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227] text-sm font-bold text-[#0B3D2E]">ف</div>
                <span className="font-bold">fadakinfo</span>
              </div>
              <p className="mt-2 text-sm leading-6">{reel.title}</p>
              <p className="mt-1 text-xs text-white/60">🎵 صدای اصلی • کربلایی حسین طاهری</p>
            </div>

            {/* دکمه صدا */}
            <button
              onClick={() => setMuted(!muted)}
              className="absolute top-4 left-4 rounded-full bg-black/50 p-3 text-white backdrop-blur"
            >
              {muted ? "🔇" : "🔊"}
            </button>

            {/* نشانگر ریلز */}
            <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
              {idx + 1} / {reels.length}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
