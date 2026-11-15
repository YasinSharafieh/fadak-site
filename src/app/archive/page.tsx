"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  date_hijri?: string;
  maddah?: string;
  status: string;
  created_at: string;
};

export default function ArchivePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
        setEvents(data || []);
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
      e.date_fa.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">آرشیو مراسم‌ها</h1>
        <p className="mt-2 text-[#3D2B1F]/70">همه مراسم‌های برگزار شده — هر مراسم یک آلبوم زنده</p>
      </div>

      {/* فیلترها */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="جستجو در مراسم‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border border-[#C9A227]/40 bg-white px-5 py-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-5 py-3 transition ${filter === "all" ? "bg-[#0B3D2E] text-white" : "border hover:bg-[#F7F3E8]"}`}
          >
            همه
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`rounded-full px-5 py-3 transition ${filter === "upcoming" ? "bg-[#0B3D2E] text-white" : "border hover:bg-[#F7F3E8]"}`}
          >
            آینده
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`rounded-full px-5 py-3 transition ${filter === "past" ? "bg-[#0B3D2E] text-white" : "border hover:bg-[#F7F3E8]"}`}
          >
            گذشته
          </button>
        </div>
      </div>

      {/* لیست مراسم‌ها */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-[#3D2B1F]/60">در حال بارگذاری...</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-[#3D2B1F]/60">مراسمی یافت نشد.</p>
        ) : (
          filtered.map((e) => (
            <Link key={e.id} href={`/archive/${e.slug}`} className="card-hover overflow-hidden rounded-2xl bg-white shadow">
              <div className="islamic-pattern relative flex h-40 items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-5xl text-white/90">
                🕌
                <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold ${
                  e.status === "upcoming" ? "bg-[#C9A227] text-[#0B3D2E]" : "bg-white/20 text-white"
                }`}>
                  {e.status === "upcoming" ? "آینده" : "گذشته"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold leading-6">{e.title}</h3>
                <p className="mt-2 text-sm text-[#3D2B1F]/70">{e.date_fa}</p>
                {e.maddah && <p className="mt-1 text-xs text-[#3D2B1F]/60">{e.maddah}</p>}
                <span className="mt-3 inline-block text-sm font-bold text-[#0E7C7B]">مشاهده جلسه ←</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-[#3D2B1F]/60">
        {filtered.length} مراسم از {events.length} مراسم
      </p>
    </div>
  );
}
