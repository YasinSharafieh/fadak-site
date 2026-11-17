"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getAparatVideoInfo } from "@/lib/aparat";

type Video = {
  id: string;
  title: string;
  aparat_id: string;
  thumbnail?: string;
  duration?: string;
  event_id: string;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
        if (data) {
          const fresh = await Promise.all(
            data.map(async (v: any) => {
              if (!v.aparat_id) return v;
              const info = await getAparatVideoInfo(v.aparat_id);
              return { ...v, thumbnail: info.thumbnail || v.thumbnail, duration: info.duration || v.duration };
            })
          );
          setVideos(fresh);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const namahang = videos.filter((v) => v.title.startsWith("نماهنگ"));
  const others = videos.filter((v) => !v.title.startsWith("نماهنگ"));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">نماهنگ‌ها و ویدیوها</h1>
        <p className="mt-2 text-white/60">ویدیوهای کانال آپارات فدک</p>
        <a href="https://www.aparat.com/fadakinfo" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10 transition">
          🎬 کانال آپارات فدک
        </a>
      </div>

      {/* نماهنگ‌ها */}
      {namahang.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-white">نماهنگ‌ها</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="col-span-full text-center text-white/50">در حال بارگذاری...</p>
            ) : (
              namahang.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.id}`}
                  className="card-hover group overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5"
                >
                  <div className="relative aspect-video bg-black">
                    {v.thumbnail ? (
                      <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-4xl text-white/20">🎬</div>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition group-hover:bg-[#0e7c7b] group-hover:scale-110">▶</span>
                    </span>
                    {v.duration && (
                      <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>
                    )}
                    <span className="absolute top-2 right-2 rounded bg-[#0e7c7b] px-2 py-1 text-[10px] font-bold text-white">نماهنگ</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold leading-6 group-hover:text-[#14a3a2] transition">{v.title}</h3>
                    <p className="mt-1 text-xs text-white/50">کربلایی حسین طاهری • آپارات</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      )}

      {/* سایر ویدیوها */}
      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-white">سایر ویدیوها</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((v) => (
              <Link
                key={v.id}
                href={`/videos/${v.id}`}
                className="card-hover group overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-4xl text-white/20">🎬</div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition group-hover:bg-[#0e7c7b] group-hover:scale-110">▶</span>
                  </span>
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold leading-6 group-hover:text-[#14a3a2] transition">{v.title}</h3>
                  <p className="mt-1 text-xs text-white/50">کربلایی حسین طاهری • آپارات</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-center text-sm text-white/50">
        {videos.length} ویدیو
      </p>
    </div>
  );
}
