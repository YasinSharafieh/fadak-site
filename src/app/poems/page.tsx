"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SectionSkeleton from "@/components/SectionSkeleton";
import CopyPoem from "@/components/CopyPoem";
import EngageBar from "@/components/EngageBar";
import { supabase } from "@/lib/supabase";
import { comparePersianDates, parsePersianDate, toPersianDigits } from "@/lib/jalali";

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

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

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

function sealOf(dateFa: string) {
  const parsed = parsePersianDate(dateFa);
  return {
    weekday: (dateFa || "").trim().split(/\s+/)[0] || "",
    day: parsed ? toPersianDigits(parsed.d) : "",
    month: parsed ? MONTHS[parsed.m - 1] || "" : "",
  };
}

export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [ceremony, setCeremony] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [poemRows, eventRows] = await Promise.all([
          supabase.from("poems").select("id,title,poet,body,event_id,created_at").order("created_at", { ascending: true }),
          supabase.from("events").select("id,title,date_fa,slug"),
        ]);
        const nextPoems = poemRows.data || [];
        const nextEvents = eventRows.data || [];
        setPoems(nextPoems);
        setEvents(nextEvents);
        const options = nextEvents
          .filter((event) => nextPoems.some((poem) => poem.event_id === event.id))
          .sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || ""));
        const night = new URLSearchParams(window.location.search).get("night");
        setCeremony(options.some((event) => event.id === night) ? night || "" : options[0]?.id || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  const eventById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);
  const query = search.trim();

  function matches(poem: Poem) {
    if (!query) return true;
    const event = poem.event_id ? eventById.get(poem.event_id) : undefined;
    return [poem.title, poem.poet, poemBody(poem), event?.title, event?.date_fa].filter(Boolean).join(" ").includes(query);
  }

  const ceremonyOptions = useMemo(
    () =>
      events
        .filter((event) => poems.some((poem) => poem.event_id === event.id))
        .sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || "")),
    [events, poems],
  );

  const selected = ceremonyOptions.find((event) => event.id === ceremony) || ceremonyOptions[0];
  const visible = poems.filter((poem) => poem.event_id === selected?.id && matches(poem));

  function choose(id: string) {
    setCeremony(id);
    const url = new URL(window.location.href);
    url.searchParams.set("night", id);
    window.history.replaceState(null, "", `${url.pathname}?${url.searchParams.toString()}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">اشعار و متون</h1>
        <p className="mt-2 text-white/70">مراسم را انتخاب کنید تا شعرهای همان شب بیاید</p>
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

      {loading ? (
        <div className="mt-8">
          <SectionSkeleton kind="poems" />
        </div>
      ) : ceremonyOptions.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/60">شعری یافت نشد.</p>
      ) : (
        <>
          <div className="mx-auto mt-9 w-max max-w-full overflow-x-auto px-1 pb-2">
            <div className="flex items-start gap-5">
              {ceremonyOptions.map((event) => {
                const active = event.id === selected?.id;
                const count = poems.filter((poem) => poem.event_id === event.id && matches(poem)).length;
                const seal = sealOf(event.date_fa || "");
                const dim = Boolean(query) && count === 0;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => choose(event.id)}
                    aria-pressed={active}
                    className={`flex w-[112px] shrink-0 flex-col items-center text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a227] md:w-[132px] ${dim ? "opacity-40" : ""}`}
                  >
                    <span className={`rounded-full p-[3px] ${active ? "bg-gradient-to-b from-[#e8c766] to-[#0e7c7b] shadow-[0_10px_28px_rgba(201,162,39,0.22)]" : "bg-[#c9a227]/35"}`}>
                      <span className={`flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full md:h-[120px] md:w-[120px] ${active ? "keep-contrast bg-[#0b3d2e] text-white" : "bg-[#1a1a1a] text-white"}`}>
                        <span className="text-[11px] font-bold text-[#c9a227]">{seal.weekday}</span>
                        <span className="mt-1 text-3xl font-extrabold leading-none">{seal.day}</span>
                        <span className="mt-1 text-sm font-bold">{seal.month}</span>
                      </span>
                    </span>
                    <span className={`mt-3 line-clamp-2 text-xs font-bold leading-5 ${active ? "text-[#c9a227]" : "text-white/75"}`}>{event.title}</span>
                    <span className="mt-1 text-[11px] text-white/50">{toPersianDigits(count)} شعر</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selected && (
            <section className="mt-8">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-white">{selected.date_fa}</h2>
                  <p className="mt-1 text-sm text-white/60">{selected.title}</p>
                </div>
                {selected.slug && (
                  <Link href={`/archive/${selected.slug}`} className="text-sm font-bold text-[#14a3a2] hover:underline">
                    صفحه مراسم
                  </Link>
                )}
              </div>

              {visible.length === 0 ? (
                <p className="rounded-2xl bg-[#1a1a1a] p-5 text-center text-sm text-white/60">
                  {query ? "در این مراسم موردی نیست. مراسم دیگری را انتخاب کنید." : "برای این مراسم شعری ثبت نشده."}
                </p>
              ) : (
                <div className="grid gap-3">
                  {visible.map((poem) => (
                    <article key={poem.id} className="gold-frame rounded-2xl bg-[#1a1a1a] p-5">
                      <h3 className="font-extrabold text-white">{poem.title}</h3>
                      <p className="poem-text mt-2 line-clamp-2 text-sm leading-7 text-white/70">{excerpt(poem)}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <Link href={`/poems/${poem.id}`} className="text-sm font-bold text-[#14a3a2] hover:underline">
                          ادامه شعر
                        </Link>
                        <div className="flex flex-wrap items-center gap-2">
                          <CopyPoem text={[poem.title, poemBody(poem)].filter(Boolean).join("\n\n")} compact />
                          <EngageBar type="poem" id={poem.id} title={poem.title} href={`/poems/${poem.id}`} compact />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
