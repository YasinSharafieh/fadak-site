"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CarouselRow from "@/components/CarouselRow";
import { toPersianDigits } from "@/lib/jalali";

type Reel = {
  id: string;
  title: string;
  cover_url?: string | null;
  duration?: string | null;
};

export default function ReelRail() {
  const [reels, setReels] = useState<Reel[] | null>(null);

  useEffect(() => {
    let gone = false;
    async function load() {
      if (!supabase) {
        setReels([]);
        return;
      }
      const { data } = await supabase.from("reels").select("id,title,cover_url,duration").order("created_at", { ascending: false }).limit(8);
      if (!gone) setReels((data || []) as Reel[]);
    }
    load();
    return () => {
      gone = true;
    };
  }, []);

  if (reels && reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs text-[#14a3a2]">اینستاگرام</span>
          <h2 className="mt-1 text-2xl font-extrabold text-white">ریلز اینستاگرام</h2>
          <p className="mt-1 text-sm text-white/60">تولیدات اینستاگرامی کربلایی حسین طاهری، همین‌جا در فدک.</p>
        </div>
        <Link href="/reels" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه ریلزها</Link>
      </div>

      {reels === null ? (
        <div className="mt-5 flex gap-4" role="status" aria-label="در حال بارگذاری ریلزها">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="fadak-shimmer h-64 w-[148px] shrink-0 rounded-3xl sm:h-72 sm:w-[168px]" />
          ))}
        </div>
      ) : (
        <CarouselRow className="mt-5 gap-4">
          {reels.map((reel) => (
            <Link
              key={reel.id}
              href={`/reels#${reel.id}`}
              className="group relative h-64 w-[148px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-black sm:h-72 sm:w-[168px]"
            >
              {reel.cover_url ? (
                <img src={reel.cover_url} alt={reel.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <span className="absolute inset-0 bg-gradient-to-b from-[#0b3d2e] to-black" />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/20" />
              <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">
                {toPersianDigits(reel.duration || "")}
              </span>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b]/90 text-white shadow-lg transition group-hover:scale-110">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </span>
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3">
                <span className="block text-[10px] text-[#14a3a2]">ریلز</span>
                <span className="mt-0.5 block text-sm font-extrabold leading-5 text-white">{reel.title}</span>
              </span>
            </Link>
          ))}
        </CarouselRow>
      )}
    </section>
  );
}
