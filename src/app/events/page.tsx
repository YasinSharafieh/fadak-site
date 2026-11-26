"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionSkeleton from "@/components/SectionSkeleton";
import CeremonyCard from "@/components/CeremonyCard";
import { supabase } from "@/lib/supabase";
import { fadakAddress, fadakMapUrl } from "@/data/mock";
import { comparePersianDates, nextWeeklyMajles, type NextMajles } from "@/lib/jalali";
import { ceremonyCardTitle, coverByEvent, shortPersianDate } from "@/lib/ceremony";
import { useTehranNow } from "@/lib/useTehranNow";

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
  poster_url?: string | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [nextMajles, setNextMajles] = useState<NextMajles | null>(null);
  const tehranNow = useTehranNow();

  useEffect(() => {
    if (tehranNow) setNextMajles(nextWeeklyMajles(tehranNow));
  }, [tehranNow]);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, ph] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }),
          supabase.from("photos").select("event_id,url,caption,created_at").order("created_at", { ascending: true }),
        ]);
        setEvents([...(ev.data || [])].sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || "")));
        setCovers(coverByEvent(ph.data || []));
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
        <h1 className="text-3xl font-extrabold text-white">مراسم‌ها</h1>
        <p className="mt-2 text-white/70/70">مراسم‌های آینده و آرشیو مراسم‌های گذشته</p>
      </div>

      {/* مراسم آینده */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-white">مراسم آینده</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            <SectionSkeleton kind="events" />
          ) : upcoming.length === 0 ? (
            <div className="col-span-full gold-frame rounded-2xl bg-[#1a1a1a] p-8 text-center">
              <div className="text-4xl">🕌</div>
              <p className="mt-3 text-xl font-extrabold">مجلس روضه هفتگی</p>
              <p className="mt-2 text-sm text-[#14a3a2]">{nextMajles ? `${nextMajles.label} — ساعت ۱۹:۳۰` : "هر سه‌شنبه — ساعت ۱۹:۳۰"}</p>
              <p className="mt-1 text-sm text-white/70">حسینیه سیدالشهدا (ع)</p>
              <p className="mt-3 text-sm leading-7 text-white/60">{fadakAddress}</p>
              <a href={fadakMapUrl} target="_blank" rel="noopener noreferrer" className="btn-green mt-5 inline-block rounded-full px-6 py-2 text-sm">مسیریابی</a>
            </div>
          ) : (
            upcoming.map((e) => (
              <article key={e.id} className="card-hover gold-frame rounded-2xl bg-[#1a1a1a] p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold">{e.title}</h3>
                    <p className="mt-2 text-sm text-white/70/80">{e.date_fa} {e.date_hijri && `| ${e.date_hijri}`}</p>
                    {e.speaker && <p className="mt-1 text-sm">سخنران: {e.speaker}</p>}
                    {e.maddah && <p className="mt-1 text-sm">مداحان: {e.maddah}</p>}
                    <p className="mt-1 text-sm text-white/70/70">{e.location || "حسینیه سیدالشهدا (ع)"}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#0e7c7b] px-3 py-1 text-xs font-bold text-white">آینده</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/archive/${e.slug}`} className="btn-green rounded-full px-5 py-2 text-sm">جزئیات</Link>
                  <a href={fadakMapUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">🗺️ مسیریابی</a>
                  <a href={`https://t.me/fadak_media_bot`} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">🔔 یادآور</a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* مراسم گذشته */}
      <section className="mt-12">
        <div className="section-head flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-extrabold text-white">مراسم‌های گذشته</h2>
          <Link href="/archive" className="text-sm font-bold text-[#14a3a2] hover:underline">آرشیو کامل ←</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            <SectionSkeleton kind="archive" />
          ) : past.length === 0 ? (
            <p className="col-span-full text-center text-sm text-white/60">هنوز مراسم گذشته‌ای ثبت نشده.</p>
          ) : (
            past.map((e) => (
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
      </section>
    </div>
  );
}
