"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionSkeleton from "@/components/SectionSkeleton";
import CopyPoem from "@/components/CopyPoem";
import { supabase } from "@/lib/supabase";
import { comparePersianDates } from "@/lib/jalali";

type Poem = {
  id: string;
  title: string;
  poet?: string | null;
  body?: string | null;
  event_id?: string | null;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  date_fa: string;
  slug: string;
};

function poemBody(poem: Poem) {
  return (poem.body || "").trim();
}

function excerpt(poem: Poem) {
  const lines = poemBody(poem)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== poem.title);
  return (lines.length ? lines : poemBody(poem).split("\n")).slice(0, 2).join(" / ");
}

export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [ceremony, setCeremony] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [poemRows, eventRows] = await Promise.all([
          supabase.from("poems").select("id,title,poet,body,event_id,created_at").order("created_at", { ascending: true }),
          supabase.from("events").select("id,title,date_fa,slug"),
        ]);
        setPoems(poemRows.data || []);
        setEvents(eventRows.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const eventById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);

  const filtered = poems.filter((poem) => {
    if (ceremony !== "all" && poem.event_id !== ceremony) return false;
    if (!search.trim()) return true;
    const event = poem.event_id ? eventById.get(poem.event_id) : undefined;
    const haystack = [poem.title, poem.poet, poemBody(poem), event?.title, event?.date_fa].filter(Boolean).join(" ");
    return haystack.includes(search.trim());
  });

  const groups = useMemo(() => {
    const byEvent = new Map<string, Poem[]>();
    for (const poem of filtered) {
      const key = poem.event_id || "none";
      const list = byEvent.get(key) || [];
      list.push(poem);
      byEvent.set(key, list);
    }
    return [...byEvent.entries()].sort((a, b) => {
      const left = eventById.get(a[0])?.date_fa || "";
      const right = eventById.get(b[0])?.date_fa || "";
      return comparePersianDates(left, right);
    });
  }, [filtered, eventById]);

  const ceremonyOptions = [...events]
    .filter((event) => poems.some((poem) => poem.event_id === event.id))
    .sort((a, b) => comparePersianDates(a.date_fa, b.date_fa));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">اشعار و متون</h1>
        <p className="mt-2 text-white/70">شعرهای اجراشده در مراسم‌های فدک، جدا برای هر مراسم</p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <input
          type="text"
          placeholder="جستجو در عنوان یا یک تکه از شعر..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-6 py-4"
        />
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCeremony("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${ceremony === "all" ? "bg-[#0b3d2e] text-[#F7F3E8]" : "bg-[#1a1a1a] text-white/70"}`}
        >
          همه مراسم‌ها
        </button>
        {ceremonyOptions.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setCeremony(event.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${ceremony === event.id ? "bg-[#0b3d2e] text-[#F7F3E8]" : "bg-[#1a1a1a] text-white/70"}`}
          >
            {event.date_fa.replace("سه‌شنبه ", "").replace("یکشنبه ", "")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8">
          <SectionSkeleton kind="poems" />
        </div>
      ) : groups.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/60">شعری یافت نشد.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map(([eventId, items]) => {
            const event = eventById.get(eventId);
            return (
              <section key={eventId}>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{event?.date_fa || "مراسم"}</h2>
                    <p className="mt-1 text-sm text-white/60">{event?.title}</p>
                  </div>
                  {event?.slug && (
                    <Link href={`/archive/${event.slug}`} className="text-sm font-bold text-[#14a3a2] hover:underline">
                      صفحه مراسم
                    </Link>
                  )}
                </div>
                <div className="grid gap-3">
                  {items.map((poem) => (
                    <article key={poem.id} className="gold-frame rounded-2xl bg-[#1a1a1a] p-5">
                      <h3 className="font-extrabold text-white">{poem.title}</h3>
                      <p className="poem-text mt-2 line-clamp-2 text-sm leading-7 text-white/70">{excerpt(poem)}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Link href={`/poems/${poem.id}`} className="text-sm font-bold text-[#14a3a2] hover:underline">
                          متن کامل
                        </Link>
                        <CopyPoem text={[poem.title, poemBody(poem)].filter(Boolean).join("\n\n")} compact />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
