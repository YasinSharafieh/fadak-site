"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import EngageBar from "@/components/EngageBar";
import SectionSkeleton from "@/components/SectionSkeleton";

type Result = {
  type: "event" | "audio" | "video" | "photo" | "reel" | "poem";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  thumb?: string;
};

// نرمال‌سازی فارسی
function normalizePersian(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/‌/g, " ")
    .replace(/[ً-ٟ]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  async function performSearch(q: string) {
    if (!q.trim() || !supabase) return;
    setLoading(true);
    const normalized = normalizePersian(q);
    const allResults: Result[] = [];

    // جستجو در مراسم‌ها
    const { data: events } = await supabase.from("events").select("*");
    events?.forEach((e) => {
      if (normalizePersian(e.title + " " + (e.maddah || "") + " " + (e.date_fa || "")).includes(normalized)) {
        allResults.push({
          type: "event",
          id: e.id,
          title: e.title,
          subtitle: e.date_fa,
          url: `/archive/${e.slug}`,
        });
      }
    });

    const eventById = new Map((events || []).map((e) => [e.id, e]));

    // جستجو در صوت‌ها — لینک به همان مراسمی که صوت مال آن است
    const { data: audios } = await supabase.from("audios").select("*");
    audios?.forEach((a) => {
      if (normalizePersian(a.title).includes(normalized)) {
        const event = a.event_id ? eventById.get(a.event_id) : null;
        allResults.push({
          type: "audio",
          id: a.id,
          title: a.title,
          subtitle: event?.title ? `صوت · ${event.title}` : "صوت",
          url: event?.slug ? `/archive/${event.slug}` : "/audio",
        });
      }
    });

    // جستجو در ویدیوها و نماهنگ‌ها — لینک به صفحهٔ همان ویدیو، نه فهرست
    const { data: videos } = await supabase.from("videos").select("*");
    videos?.forEach((v) => {
      if (normalizePersian(v.title).includes(normalized)) {
        const isNamahang = normalizePersian(v.title || "").includes("نماهنگ");
        allResults.push({
          type: "video",
          id: v.id,
          title: v.title,
          subtitle: isNamahang ? "نماهنگ" : "ویدیو",
          url: `/videos/${v.id}`,
        });
      }
    });

    const { data: poems } = await supabase.from("poems").select("id,title,body,event_id");
    poems?.forEach((poem) => {
      const event = poem.event_id ? eventById.get(poem.event_id) : null;
      const haystack = `${poem.title || ""} ${poem.body || ""}`;
      if (normalizePersian(haystack).includes(normalized)) {
        allResults.push({
          type: "poem",
          id: poem.id,
          title: poem.title,
          subtitle: event?.date_fa ? `شعر · ${event.date_fa}` : "شعر",
          url: `/poems/${poem.id}`,
        });
      }
    });

    const { data: reels } = await supabase.from("reels").select("id,title,cover_url");
    reels?.forEach((reel) => {
      if (normalizePersian(reel.title || "").includes(normalized)) {
        allResults.push({
          type: "reel",
          id: reel.id,
          title: reel.title,
          subtitle: "ریلز",
          url: `/reels#${reel.id}`,
          thumb: reel.cover_url || undefined,
        });
      }
    });

    setResults(allResults);
    setLoading(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "event": return "🕌";
      case "audio": return "🎵";
      case "video": return "🎬";
      case "reel": return "🎞️";
      case "poem": return "📜";
      case "photo": return "📷";
      default: return "📄";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">جستجوی سراسری</h1>
        <p className="mt-2 text-white/70/70">جستجو در مراسم‌ها، صوت‌ها، ویدیوها، ریلزها و اشعار</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام مراسم، مداح، عنوان صوت یا ریلز..."
              className="w-full rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] py-4 pe-16 ps-6 text-lg"
            />
            <button type="submit" aria-label="جستجو" title="جستجو" className="absolute end-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#0e7c7b] text-white shadow-lg transition hover:bg-[#14a3a2]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
          </div>
          <button type="submit" className="btn-gold rounded-full px-8 py-4">
            جستجو
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <SectionSkeleton kind="search" />
        ) : query && results.length === 0 ? (
          <p className="text-center text-white/70/60">نتیجه‌ای یافت نشد.</p>
        ) : results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-white/70/60">{results.length} نتیجه یافت شد</p>
            <div data-motion-stagger="row" className="space-y-3">
              {results.map((r) => (
                <div key={`${r.type}-${r.id}`} className="card-hover flex items-center gap-4 rounded-2xl bg-[#1a1a1a] p-4 shadow">
                  <Link href={r.url} className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="text-2xl">{getIcon(r.type)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{r.title}</div>
                      {r.subtitle && <div className="text-sm text-white/70/60">{r.subtitle}</div>}
                    </div>
                    <span className="text-[#14a3a2]">←</span>
                  </Link>
                  {(r.type === "video" || r.type === "audio" || r.type === "reel") && (
                    <EngageBar type={r.type} id={r.id} title={r.title} href={r.url} thumb={r.thumb} compact />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
