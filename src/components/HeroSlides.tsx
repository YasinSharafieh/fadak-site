"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NextMajles } from "@/lib/jalali";

type Recent = {
  id: string;
  href: string;
  title: string;
  date: string;
  cover?: string;
};

type Props = {
  nextMajles: NextMajles | null;
  recent: Recent[];
};

export default function HeroSlides({ nextMajles, recent }: Props) {
  const count = 1 + recent.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  const go = (dir: 1 | -1) => setIndex((current) => (current + dir + count) % count);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[#c9a227]/30 bg-[#0b3d2e] shadow-2xl"
      dir="ltr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        <article dir="rtl" className="keep-contrast relative min-h-[340px] w-full shrink-0 bg-gradient-to-br from-[#0b3d2e] via-[#0e7c7b] to-[#08261f] p-6 text-white sm:min-h-[380px] sm:p-8">
          <div className="islamic-pattern-dark absolute inset-0 opacity-70" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <span className="rounded-full border border-[#c9a227]/50 px-3 py-1 text-xs font-bold text-[#c9a227]">مراسم بعدی</span>
              <h2 className="mt-4 text-2xl font-extrabold leading-10 sm:text-3xl">مجلس روضه هفتگی</h2>
              <p className="mt-3 text-lg text-white/90">{nextMajles ? nextMajles.label : "هر سه‌شنبه"}</p>
              <p className="mt-1 text-sm text-white/70">ساعت ۱۹:۳۰ · حسینیه سیدالشهدا (ع)</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/events" className="btn-gold rounded-full px-5 py-2.5 text-sm">جزئیات و مسیریابی</Link>
              <Link href="/archive" className="rounded-full border border-white/30 px-5 py-2.5 text-sm hover:bg-white/10">آرشیو مراسمات</Link>
            </div>
          </div>
        </article>

        {recent.map((item) => (
          <article key={item.id} dir="rtl" className="relative min-h-[340px] w-full shrink-0 sm:min-h-[380px]">
            {item.cover ? (
              <img src={item.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b3d2e] to-[#111]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
            <div className="keep-contrast relative flex h-full min-h-[340px] flex-col justify-end p-6 text-white sm:min-h-[380px] sm:p-8">
              <span className="w-fit rounded-full border border-[#c9a227]/50 bg-black/30 px-3 py-1 text-xs font-bold text-[#c9a227]">مراسم اخیر</span>
              <h2 className="mt-3 text-xl font-extrabold leading-8 sm:text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm text-white/75">{item.date}</p>
              <Link href={item.href} className="btn-green mt-4 w-fit rounded-full px-5 py-2.5 text-sm">مشاهده مراسم</Link>
            </div>
          </article>
        ))}
      </div>

      {count > 1 && (
        <>
          <button type="button" onClick={() => go(1)} aria-label="اسلاید بعدی" className="keep-contrast absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-[#0e7c7b]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <button type="button" onClick={() => go(-1)} aria-label="اسلاید قبلی" className="keep-contrast absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-[#0e7c7b]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: count }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`اسلاید ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`keep-contrast h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#c9a227]" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
