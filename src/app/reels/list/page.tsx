"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import EngageBar from "@/components/EngageBar";
import { toPersianDigits } from "@/lib/jalali";

type Reel = {
  id: string;
  title: string;
  cover_url?: string | null;
  duration?: string | null;
};

export default function ReelsListPage() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">ریلزها</h1>
        <p className="mt-2 text-sm text-white/60">از تازه‌ترین به قدیمی‌ترین</p>
        <Link href="/reels" className="mt-4 inline-block rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10">
          تماشای پیوسته
        </Link>
      </div>

      {reels === null ? (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" role="status" aria-busy="true">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="reel-shelf-card fadak-shimmer aspect-[9/16]" />
          ))}
        </div>
      ) : reels.length === 0 ? (
        <p className="mt-10 text-center text-sm text-white/60">هنوز ریلزی ثبت نشده.</p>
      ) : (
        <div data-motion-stagger="photo" className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {reels.map((reel) => (
            <article key={reel.id} className="reel-shelf-card">
              <Link href={`/reels#${reel.id}`} className="block">
                <div className="relative aspect-[9/16] overflow-hidden bg-black">
                  {reel.cover_url ? (
                    <img src={reel.cover_url} alt="" className="h-full w-full object-cover" />
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
                <h2 className="line-clamp-2 px-3 pt-3 text-sm font-bold leading-5 text-white">{reel.title}</h2>
              </Link>
              <div className="px-2 pb-3 pt-2">
                <EngageBar type="reel" id={reel.id} title={reel.title} href={`/reels#${reel.id}`} thumb={reel.cover_url || ""} compact />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
