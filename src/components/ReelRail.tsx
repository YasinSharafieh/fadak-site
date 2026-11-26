"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CarouselRow from "@/components/CarouselRow";
import EngageBar from "@/components/EngageBar";
import { toPersianDigits } from "@/lib/jalali";

const INSTAGRAM = "https://www.instagram.com/hoseintaheri_";

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
        if (!gone) setReels([]);
        return;
      }
      const primary = await supabase
        .from("reels")
        .select("id,title,cover_url,duration")
        .order("published_at", { ascending: false })
        .limit(8);
      const result = primary.error
        ? await supabase
            .from("reels")
            .select("id,title,cover_url,duration")
            .order("created_at", { ascending: false })
            .limit(8)
        : primary;
      if (!gone) setReels((result.data || []) as Reel[]);
    }
    load();
    return () => {
      gone = true;
    };
  }, []);

  if (reels && reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8" aria-label="ریلز">
      <div className="reel-home relative overflow-hidden rounded-[28px] px-4 py-5 sm:px-6">
        <div className="reel-home-glow" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-[12rem] flex-1 items-start gap-3">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="reel-ig-mark" aria-label="اینستاگرام حسین طاهری">
              <img src="/brand/platforms/instagram.png" alt="" className="h-8 w-8 rounded-lg" />
            </a>
            <div className="min-w-0">
              <p className="reel-kicker">
                <span className="reel-live" aria-hidden="true" />
                اینستاگرام حسین طاهری
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">ریلز</h2>
              <p className="mt-1 text-sm text-white/70">
                {reels ? `${toPersianDigits(reels.length)} ریلز تازه، همین‌جا در فدک.` : "در حال آماده‌سازی ریلزها"}
              </p>
            </div>
          </div>
          <Link href="/reels" className="reel-all shrink-0">
            تماشای ریلزها
          </Link>
        </div>

        {reels === null ? (
          <div className="mt-5 flex gap-4" role="status" aria-label="در حال بارگذاری ریلزها">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="reel-card-home">
                <div className="fadak-shimmer reel-cover" />
              </div>
            ))}
          </div>
        ) : (
          <CarouselRow className="mt-5 snap-x snap-mandatory gap-4">
            {reels.map((reel, index) => (
              <article key={reel.id} className={`reel-card-home snap-start ${index === 0 ? "is-featured" : ""}`}>
                <Link href={`/reels#${reel.id}`} className="reel-cover on-media group" aria-label={reel.title}>
                  {reel.cover_url ? (
                    <img src={reel.cover_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 bg-gradient-to-b from-[#0b3d2e] to-black" />
                  )}
                  <span className="reel-play" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  {index === 0 ? <span className="reel-fresh">تازه</span> : null}
                  {reel.duration ? (
                    <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                      {toPersianDigits(reel.duration)}
                    </span>
                  ) : null}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/45 to-transparent px-3 pb-3 pt-14">
                    <span className="block text-[10px] font-bold text-[#e8c766]">ریلز</span>
                    <span className="mt-0.5 line-clamp-2 block text-sm font-extrabold leading-5 text-white">{reel.title}</span>
                  </span>
                </Link>
                <div className="px-1 pt-2">
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
