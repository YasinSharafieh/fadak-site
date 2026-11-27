"use client";

import { useEffect, useState } from "react";
import SectionSkeleton from "@/components/SectionSkeleton";
import { supabase } from "@/lib/supabase";

function visibleCaption(caption?: string) {
  const text = (caption || "").trim();
  if (!text || text === "عکس مراسم") return "";
  return text;
}

type Photo = {
  id: string;
  url: string;
  caption?: string;
  event_id: string;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  date_fa: string;
};

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ph, ev] = await Promise.all([
          supabase.from("photos").select("*").order("created_at", { ascending: false }),
          supabase.from("events").select("id,title,date_fa").order("created_at", { ascending: false }),
        ]);
        setPhotos(ph.data || []);
        setEvents(ev.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = photos.filter((p) => filterEvent === "all" || p.event_id === filterEvent);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">گالری عکس</h1>
        <p className="mt-2 text-white/70/70">تصاویر مراسم‌های فدک</p>
      </div>

      {/* فیلتر */}
      <div className="mx-auto mt-8 max-w-md">
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="w-full rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-5 py-3"
        >
          <option value="all">همه مراسم‌ها</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title} — {e.date_fa}</option>
          ))}
        </select>
      </div>

      {/* گالری */}
      <div data-motion-stagger="photo" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <SectionSkeleton kind="photos" />
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-white/70/60">عکسی یافت نشد.</p>
        ) : (
          filtered.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={photo.url}
                alt=""
                className="aspect-square w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
              {visibleCaption(photo.caption) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-right text-xs text-white opacity-0 transition group-hover:opacity-100">
                  {visibleCaption(photo.caption)}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-white/70/60">
        {filtered.length} عکس از {photos.length} عکس
      </p>

      {/* لایت‌باکس */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.url} alt="" className="max-h-[80vh] w-auto rounded-2xl" />
            {visibleCaption(lightbox.caption) && (
              <p className="mt-4 text-center text-white">{visibleCaption(lightbox.caption)}</p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 rounded-full bg-[#1a1a1a]/20 p-3 text-white hover:bg-[#1a1a1a]/30 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
