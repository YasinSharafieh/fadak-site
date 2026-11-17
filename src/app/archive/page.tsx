"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { comparePersianDates } from "@/lib/jalali";
import { ceremonyCardTitle, coverByEvent, shortPersianDate } from "@/lib/ceremony";
import CeremonyCard from "@/components/CeremonyCard";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  maddah?: string;
  status: string;
  poster_url?: string | null;
  created_at: string;
};

export default function ArchivePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, ph] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }),
          supabase.from("photos").select("event_id,url,caption,created_at").order("created_at", { ascending: true }),
        ]);
        const rows = [...(ev.data || [])].sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || ""));
        setEvents(rows);
        setCovers(coverByEvent(ph.data || []));
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = events.filter((e) => {
    const matchFilter = filter === "all" || e.status === filter;
    const matchSearch = !search ||
      e.title.includes(search) ||
      (e.maddah && e.maddah.includes(search)) ||
      (e.date_fa || "").includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">آرشیو مراسم‌ها</h1>
        <p className="mt-2 text-white/70">همه مراسم‌های برگزار شده — هر مراسم یک آلبوم زنده</p>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="جستجو در مراسم‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-5 py-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-5 py-3 transition ${filter === "all" ? "bg-[#0b3d2e] text-white" : "border hover:bg-[#111111]"}`}
          >
            همه
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`rounded-full px-5 py-3 transition ${filter === "upcoming" ? "bg-[#0b3d2e] text-white" : "border hover:bg-[#111111]"}`}
          >
            آینده
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`rounded-full px-5 py-3 transition ${filter === "past" ? "bg-[#0b3d2e] text-white" : "border hover:bg-[#111111]"}`}
          >
            گذشته
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <p className="col-span-full text-center text-white/60">در حال بارگذاری...</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-white/60">مراسمی یافت نشد.</p>
        ) : (
          filtered.map((e) => (
            <CeremonyCard
              key={e.id}
              href={`/archive/${e.slug}`}
              title={ceremonyCardTitle(e.title, e.date_fa)}
              dateLabel={shortPersianDate(e.date_fa)}
              coverUrl={e.poster_url || covers[e.id]}
              className="w-full"
            />
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-white/60">
        {filtered.length} مراسم از {events.length} مراسم
      </p>
    </div>
  );
}
