"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { fadakAddress, fadakMapUrl } from "@/data/mock";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  date_hijri?: string;
  speaker?: string;
  maddah?: string;
  location?: string;
  status: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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

  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">مراسم‌ها</h1>
        <p className="mt-2 text-[#3D2B1F]/70">مراسم‌های آینده و آرشیو مراسم‌های گذشته</p>
      </div>

      {/* مراسم آینده */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-[#0B3D2E]">مراسم آینده</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="col-span-full text-center text-[#3D2B1F]/60">در حال بارگذاری...</p>
          ) : upcoming.length === 0 ? (
            <div className="col-span-full gold-frame rounded-2xl bg-white p-8 text-center">
              <div className="text-4xl">🕌</div>
              <p className="mt-3 font-bold">مراسم آینده‌ای ثبت نشده</p>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">مراسم‌های روضه هفتگی هر سه‌شنبه برگزار می‌شود</p>
              <p className="mt-3 text-sm">{fadakAddress}</p>
            </div>
          ) : (
            upcoming.map((e) => (
              <article key={e.id} className="card-hover gold-frame rounded-2xl bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold">{e.title}</h3>
                    <p className="mt-2 text-sm text-[#3D2B1F]/80">{e.date_fa} {e.date_hijri && `| ${e.date_hijri}`}</p>
                    {e.speaker && <p className="mt-1 text-sm">سخنران: {e.speaker}</p>}
                    {e.maddah && <p className="mt-1 text-sm">مداحان: {e.maddah}</p>}
                    <p className="mt-1 text-sm text-[#3D2B1F]/70">{e.location || "حسینیه سیدالشهدا (ع)"}</p>
                  </div>
                  <span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-bold text-[#0B3D2E]">آینده</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/archive/${e.slug}`} className="btn-green rounded-full px-5 py-2 text-sm">جزئیات</Link>
                  <a href={fadakMapUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#F7F3E8] transition">🗺️ مسیریابی</a>
                  <a href={`https://t.me/fadak_media_bot`} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#F7F3E8] transition">🔔 یادآور</a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* مراسم گذشته */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#0B3D2E]">مراسم‌های گذشته</h2>
          <Link href="/archive" className="text-sm font-bold text-[#0E7C7B] hover:underline">آرشیو کامل ←</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {past.slice(0, 6).map((e) => (
            <Link key={e.id} href={`/archive/${e.slug}`} className="card-hover overflow-hidden rounded-2xl bg-white shadow">
              <div className="islamic-pattern flex h-36 items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-4xl text-white/90">🕌</div>
              <div className="p-5">
                <h3 className="font-bold">{e.title}</h3>
                <p className="mt-1 text-sm text-[#3D2B1F]/70">{e.date_fa}</p>
                {e.maddah && <p className="mt-1 text-xs text-[#3D2B1F]/60">{e.maddah}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
