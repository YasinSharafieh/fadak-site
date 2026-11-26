"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Reel = {
  id: string;
  title: string;
  cover_url?: string | null;
};

const ORBIT_VISIBLE = 8;
const ORBIT_LIMIT = 12;

export default function ReelRail() {
  const [reels, setReels] = useState<Reel[] | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const shown = reels === null ? null : reels.slice(0, ORBIT_LIMIT);
  const isLong = shown !== null && shown.length > ORBIT_VISIBLE;

  useEffect(() => {
    let gone = false;
    async function load() {
      if (!supabase) {
        if (!gone) setReels([]);
        return;
      }
      const { data } = await supabase
        .from("reels")
        .select("id,title,cover_url,created_at")
        .order("created_at", { ascending: false });
      if (!gone) setReels((data || []) as Reel[]);
    }
    load();
    return () => {
      gone = true;
    };
  }, []);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (el) el.scrollLeft = 0;
  }, [shown?.length]);

  if (reels && reels.length === 0) return null;

  return (
    <section className="reel-orbit" aria-label="ریلز">
      <div ref={rowRef} className={`reel-orbit-row ${isLong ? "is-long" : ""}`} role={reels === null ? "status" : undefined} aria-busy={reels === null}>
        {shown === null
          ? [0, 1, 2].map((item) => (
              <span key={item} className={`reel-orbit-item ${item === 0 ? "is-live" : ""}`} aria-hidden="true">
                <span className="reel-orbit-slot">
                  <span className="reel-orbit-disc">
                    <span className="reel-orbit-ring" />
                    <span className="reel-orbit-face fadak-shimmer" />
                  </span>
                </span>
                <span className="reel-orbit-name is-bone fadak-shimmer" />
              </span>
            ))
          : shown.map((reel, index) => (
              <Link
                key={reel.id}
                href={`/reels#${reel.id}`}
                className={`reel-orbit-item ${index === 0 ? "is-live" : ""}`}
                aria-label={reel.title}
              >
                <span className="reel-orbit-slot">
                  <span className="reel-orbit-disc">
                    <span className="reel-orbit-ring" aria-hidden="true" />
                    <span className="reel-orbit-face">
                      {reel.cover_url ? <img src={reel.cover_url} alt="" /> : <span className="reel-orbit-empty" />}
                      <span className="reel-orbit-play" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </span>
                <span className="reel-orbit-name">{reel.title}</span>
              </Link>
            ))}
      </div>
    </section>
  );
}
