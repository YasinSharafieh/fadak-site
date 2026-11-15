"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">نماهنگ‌ها و ویدیوها</h1>
        <p className="mt-2 text-[#3D2B1F]/70">ویدیوهای کانال آپارات فدک</p>
        <a href="https://www.aparat.com/fadakinfo" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full border px-5 py-2 text-sm hover:bg-[#F7F3E8] transition">
          🎬 کانال آپارات فدک
        </a>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-[#3D2B1F]/60">در حال بارگذاری...</p>
        ) : videos.length === 0 ? (
          <p className="col-span-full text-center text-[#3D2B1F]/60">ویدیویی یافت نشد.</p>
        ) : (
          videos.map((v) => (
            <a
              key={v.id}
              href={`https://www.aparat.com/v/${v.aparat_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover group overflow-hidden rounded-2xl bg-white shadow"
            >
              <div className="relative aspect-video bg-black">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-5xl text-white/50">🎬</div>
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition group-hover:bg-[#C9A227] group-hover:text-[#0B3D2E]">▶</span>
                </span>
                {v.duration && (
                  <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold leading-6">{v.title}</h3>
                <p className="mt-1 text-xs text-[#3D2B1F]/60">کربلایی حسین طاهری • آپارات</p>
              </div>
            </a>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-[#3D2B1F]/60">
        {videos.length} ویدیو
      </p>
    </div>
  );
}
