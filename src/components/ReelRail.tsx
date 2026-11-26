"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Reel = {
  id: string;
  title: string;
  cover_url?: string | null;
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
        .select("id,title,cover_url")
        .order("published_at", { ascending: false })
        .limit(8);
      const result = primary.error
        ? await supabase.from("reels").select("id,title,cover_url").order("created_at", { ascending: false }).limit(8)
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
    <section className="reel-orbit" aria-label="ریلز">
      <div className="reel-orbit-row no-scrollbar" role={reels === null ? "status" : undefined} aria-busy={reels === null}>
        {reels === null
          ? [0, 1, 2].map((item) => (
              <span key={item} className={`reel-orbit-item ${item === 0 ? "is-live" : ""}`} aria-hidden="true">
                <span className="reel-orbit-ring" />
                <span className="reel-orbit-face fadak-shimmer" />
              </span>
            ))
          : reels.map((reel, index) => (
              <Link
                key={reel.id}
                href={`/reels#${reel.id}`}
                className={`reel-orbit-item ${index === 0 ? "is-live" : ""}`}
                aria-label={reel.title}
              >
                <span className="reel-orbit-ring" aria-hidden="true" />
                <span className="reel-orbit-face">
                  {reel.cover_url ? (
                    <img src={reel.cover_url} alt="" />
                  ) : (
                    <span className="reel-orbit-empty" />
                  )}
                  <span className="reel-orbit-play" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </Link>
            ))}
      </div>
    </section>
  );
}
