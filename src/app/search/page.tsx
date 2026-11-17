"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Result = {
  type: "event" | "audio" | "video" | "photo";
  id: string;
  title: string;
  subtitle?: string;
  url: string;
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

    // جستجو در صوت‌ها
    const { data: audios } = await supabase.from("audios").select("*");
    audios?.forEach((a) => {
      if (normalizePersian(a.title).includes(normalized)) {
        allResults.push({
          type: "audio",
          id: a.id,
          title: a.title,
          subtitle: "صوت",
          url: `/audio`,
        });
      }
    });

    // جستجو در ویدیوها
    const { data: videos } = await supabase.from("videos").select("*");
    videos?.forEach((v) => {
      if (normalizePersian(v.title).includes(normalized)) {
        allResults.push({
          type: "video",
          id: v.id,
          title: v.title,
          subtitle: "ویدیو",
          url: `/videos`,
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
      case "photo": return "📷";
      default: return "📄";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">جستجوی سراسری</h1>
        <p className="mt-2 text-white/70/70">جستجو در مراسم‌ها، صوت‌ها، ویدیوها و اشعار</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام مراسم، مداح، عنوان صوت..."
            className="flex-1 rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-6 py-4 text-lg"
          />
          <button type="submit" className="btn-gold rounded-full px-8 py-4">
            جستجو
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <p className="text-center text-white/70/60">در حال جستجو...</p>
        ) : query && results.length === 0 ? (
          <p className="text-center text-white/70/60">نتیجه‌ای یافت نشد.</p>
        ) : results.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-white/70/60">{results.length} نتیجه یافت شد</p>
            <div className="space-y-3">
              {results.map((r) => (
                <Link key={`${r.type}-${r.id}`} href={r.url} className="card-hover flex items-center gap-4 rounded-2xl bg-[#1a1a1a] p-4 shadow">
                  <span className="text-2xl">{getIcon(r.type)}</span>
                  <div className="flex-1">
                    <div className="font-bold">{r.title}</div>
                    {r.subtitle && <div className="text-sm text-white/70/60">{r.subtitle}</div>}
                  </div>
                  <span className="text-[#14a3a2]">←</span>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
