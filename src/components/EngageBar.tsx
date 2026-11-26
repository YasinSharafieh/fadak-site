"use client";

import { useEffect, useState } from "react";
import ShareButton from "@/components/ShareButton";
import { toPersianDigits } from "@/lib/jalali";

type Kind = "video" | "audio" | "reel" | "poem";

type Props = {
  type: Kind;
  id: string;
  title: string;
  href: string;
  thumb?: string;
  compact?: boolean;
  share?: boolean;
};

type State = { count: number; liked: boolean; saved: boolean };

const cache = new Map<string, State>();
const waiters = new Map<string, Array<(state: State) => void>>();
let timer = 0;

function keyOf(type: string, id: string) {
  return `${type}:${id}`;
}

export function rememberEngage(type: string, id: string, patch: Partial<State>) {
  const key = keyOf(type, id);
  const prev = cache.get(key) || { count: 0, liked: false, saved: false };
  const next = { ...prev, ...patch };
  cache.set(key, next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fadak-engage", { detail: { key, state: next } }));
  }
}

function queue(type: string, id: string, setState: (state: State) => void) {
  const key = keyOf(type, id);
  const known = cache.get(key);
  if (known) setState(known);
  const list = waiters.get(key) || [];
  list.push(setState);
  waiters.set(key, list);
  window.clearTimeout(timer);
  timer = window.setTimeout(flush, 40);
}

async function flush() {
  const keys = [...waiters.keys()].filter((key) => !cache.has(key));
  if (keys.length === 0) {
    waiters.clear();
    return;
  }
  const pending = new Map(waiters);
  waiters.clear();
  try {
    const res = await fetch(`/api/engage?keys=${encodeURIComponent(keys.join(","))}`);
    const data = await res.json();
    for (const key of keys) {
      const state = {
        count: data.counts?.[key] || 0,
        liked: Boolean(data.mine?.[key]?.liked),
        saved: Boolean(data.mine?.[key]?.saved),
      };
      cache.set(key, state);
      pending.get(key)?.forEach((fn) => fn(state));
    }
  } catch {
    pending.forEach((list) => list.forEach((fn) => fn({ count: 0, liked: false, saved: false })));
  }
}

export default function EngageBar({ type, id, title, href, thumb, compact, share = true }: Props) {
  const [state, setState] = useState<State>({ count: 0, liked: false, saved: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    queue(type, id, setState);
    const key = keyOf(type, id);
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string; state: State }>).detail;
      if (detail?.key === key) setState(detail.state);
    };
    window.addEventListener("fadak-engage", onSync);
    return () => window.removeEventListener("fadak-engage", onSync);
  }, [type, id]);

  async function act(action: "like" | "save") {
    if (busy) return;
    setBusy(true);
    const res = await fetch("/api/engage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, action, title, href, thumb }),
    });
    if (res.status === 401) {
      const next = `${window.location.pathname}${window.location.search}`;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
      return;
    }
    if (res.ok) {
      const data = await res.json();
      const next = { count: data.count || 0, liked: Boolean(data.liked), saved: Boolean(data.saved) };
      cache.set(keyOf(type, id), next);
      setState(next);
    }
    setBusy(false);
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "mt-1"}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          act("like");
        }}
        aria-label={state.liked ? "برداشتن لایک" : "لایک"}
        title={state.liked ? "لایک شما ثبت شده" : "لایک"}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition ${
          state.liked
            ? "border-[#c9a227] bg-[#c9a227]/15 text-[#e8c766]"
            : "border-white/15 bg-black/30 text-white/75 hover:border-[#c9a227] hover:text-[#e8c766]"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={state.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
        </svg>
        {toPersianDigits(state.count)}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          act("save");
        }}
        aria-label={state.saved ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
        title={state.saved ? "در علاقه‌مندی‌های شماست" : "افزودن به علاقه‌مندی"}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition ${
          state.saved
            ? "border-[#0e7c7b] bg-[#0e7c7b] text-white"
            : "border-white/15 bg-black/30 text-white/75 hover:border-[#14a3a2] hover:text-[#14a3a2]"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={state.saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
        </svg>
      </button>
      {share && <ShareButton title={title} path={href} compact />}
    </div>
  );
}
