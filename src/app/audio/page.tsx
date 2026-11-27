"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AudioPlayer from "@/components/AudioPlayer";
import SectionSkeleton from "@/components/SectionSkeleton";

type Audio = {
  id: string;
  title: string;
  file_url: string;
  event_id: string;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  date_fa: string;
  slug?: string;
};

export default function AudioPage() {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filterEvent, setFilterEvent] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [au, ev] = await Promise.all([
          supabase.from("audios").select("*").order("created_at", { ascending: false }),
          supabase.from("events").select("id,title,date_fa,slug").order("created_at", { ascending: false }),
        ]);
        setAudios(au.data || []);
        setEvents(ev.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = audios.filter((a) => {
    const matchEvent = filterEvent === "all" || a.event_id === filterEvent;
    const matchSearch = !search || a.title.includes(search);
    return matchEvent && matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">کتابخانه صوتی</h1>
        <p className="mt-2 text-white/70/70">آرشیو کامل صوت‌های مراسم‌های فدک</p>
      </div>

      {/* فیلترها */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="جستجو در صوت‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-5 py-3"
        />
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-5 py-3"
        >
          <option value="all">همه مراسم‌ها</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title} — {e.date_fa}</option>
          ))}
        </select>
      </div>

      {/* لیست صوت‌ها */}
      <div data-motion-stagger="row" className="mt-8 space-y-3">
        {loading ? (
          <SectionSkeleton kind="audio" />
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/70/60">صوتی یافت نشد.</p>
        ) : (
          filtered.map((a) => (
            <AudioPlayer key={a.id} id={a.id} title={a.title} src={a.file_url} href={events.find((event) => event.id === a.event_id)?.slug ? `/archive/${events.find((event) => event.id === a.event_id)?.slug}` : "/audio"} />
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-white/70/60">
        {filtered.length} صوت از {audios.length} صوت
      </p>
    </div>
  );
}
