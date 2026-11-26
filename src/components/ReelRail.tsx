"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CarouselRow from "@/components/CarouselRow";
import EngageBar from "@/components/EngageBar";
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
      const { data } = await supabase
        .from("reels")
        .select("id,title,cover_url,duration")
        .order("created_at", { ascending: false })
        .limit(8);
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
      <div className="reel-home keep-contrast overflow-hidden rounded-[28px] px-4 py-5 text-white sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <img src="/brand/platforms/instagram.png" alt="" className="mt-1 h-8 w-8 shrink-0 rounded-lg" />
            <div>
              <span className="text-xs text-[#14a3a2]">اینستاگرام حسین طاهری</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">ریلز اینستاگرام</h2>
              <p className="mt-1 text-sm text-white/70">
                {reels ? `${toPersianDigits(reels.length)} ریلز تازه، همین‌جا در فدک.` : "در حال آماده‌سازی ریلزها"}
              </p>
            </div>
          </div>
          <Link href="/reels" className="shrink-0 rounded-full bg-[#0e7c7b] px-4 py-2 text-sm font-bold text-white hover:bg-[#14a3a2]">
            تماشای ریلزها
          </Link>
        </div>

        {reels === null ? (
          <div className="mt-5 flex gap-4" role="status" aria-label="در حال بارگذاری ریلزها">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="fadak-shimmer h-[280px] w-[158px] shrink-0 rounded-[22px]" />
            ))}
          </div>
        ) : (
          <CarouselRow className="mt-5 gap-4">
            {reels.map((reel) => (
              <article key={reel.id} className="relative h-[300px] w-[168px] shrink-0 overflow-hidden rounded-[22px] bg-black ring-1 ring-[#14a3a2]/35">
                <Link href={`/reels#${reel.id}`} className="absolute inset-0 z-0" aria-label={reel.title}>
                  {reel.cover_url ? (
                    <img src={reel.cover_url} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  ) : (
                    <span className="absolute inset-0 bg-gradient-to-b from-[#0b3d2e] to-black" />
                  )}
                </Link>
                <span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/15 to-black/25" />
                <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                  {toPersianDigits(reel.duration || "")}
                </span>
                <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b]/90 text-white shadow-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 pb-12">
                  <span className="block text-[10px] text-[#14a3a2]">ریلز</span>
                  <span className="mt-0.5 block text-sm font-extrabold leading-5 text-white">{reel.title}</span>
                </div>
                <div className="absolute inset-x-2 bottom-2 z-20">
                  <EngageBar type="reel" id={reel.id} title={reel.title} href={`/reels#${reel.id}`} thumb={reel.cover_url || ""} compact share />
                </div>
              </article>
            ))}
          </CarouselRow>
        )}
      </div>
    </section>
  );
}
