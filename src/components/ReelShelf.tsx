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
  created_at?: string | null;
};

export default function ReelShelf() {
  const [reels, setReels] = useState<Reel[] | null>(null);

  useEffect(() => {
    let gone = false;
    async function load() {
      if (!supabase) {
        if (!gone) setReels([]);
        return;
      }
      const { data } = await supabase.from("reels").select("id,title,cover_url,duration,created_at").order("created_at", { ascending: false });
      if (!gone) setReels((data || []) as Reel[]);
    }
    load();
    return () => {
      gone = true;
    };
  }, []);

  if (reels && reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8" aria-label="همه ریلزها">
      <div className="section-head flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs text-[#14a3a2]">ریلز</span>
          <h2 className="mt-1 text-2xl font-extrabold text-white">جدیدترین ریلزها</h2>
        </div>
        <Link href="/reels/list" className="shrink-0 text-sm text-[#14a3a2] hover:underline">
          همه ریلزها
        </Link>
      </div>

      {reels === null ? (
        <div className="mt-5 flex gap-4" role="status" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="reel-shelf-card reel-shelf-scroll fadak-shimmer" />
          ))}
        </div>
      ) : (
        <CarouselRow className="mt-5 gap-4">
          {reels.map((reel) => (
            <article key={reel.id} className="reel-shelf-card reel-shelf-scroll">
              <Link href={`/reels#${reel.id}`} className="block">
                <div className="relative aspect-[9/16] overflow-hidden bg-black">
                  {reel.cover_url ? (
                    <img src={reel.cover_url} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  ) : (
                    <span className="absolute inset-0 bg-gradient-to-b from-[#0b3d2e] to-black" />
                  )}
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0e7c7b]/90 text-white shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                  {reel.duration ? (
                    <span className="on-media absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[11px] font-bold text-white">
                      {toPersianDigits(reel.duration)}
                    </span>
                  ) : null}
                </div>
                <h3 className="line-clamp-2 px-3 pt-3 text-sm font-bold leading-5 text-white">{reel.title}</h3>
              </Link>
              <div className="px-2 pb-3 pt-2">
                <EngageBar type="reel" id={reel.id} title={reel.title} href={`/reels#${reel.id}`} thumb={reel.cover_url || ""} compact />
              </div>
            </article>
          ))}
        </CarouselRow>
      )}
      <p className="mt-1 text-xs text-white/40">برای دیدن ریلزهای قدیمی‌تر بکشید ←</p>
    </section>
  );
}
