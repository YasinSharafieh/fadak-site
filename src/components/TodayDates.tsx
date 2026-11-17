"use client";

import { useEffect, useState } from "react";
import { msUntilTehranMidnight } from "@/lib/jalali";

type Line = { key: string; label: string; value: string };

function formatIn(calendar: string, now: Date) {
  return new Intl.DateTimeFormat(`fa-IR-u-ca-${calendar}`, {
    timeZone: "Asia/Tehran",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
}

function linesFor(now: Date): Line[] {
  return [
    { key: "shamsi", label: "شمسی", value: formatIn("persian", now) },
    { key: "qamari", label: "قمری", value: formatIn("islamic-umalqura", now) },
    { key: "miladi", label: "میلادی", value: formatIn("gregory", now) },
  ];
}

/** تاریخ امروز به سه تقویم. نیمه‌شب به وقت تهران خودش عوض می‌شود. */
export default function TodayDates() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let midnight: number;
    const refresh = () => {
      setNow(new Date());
      midnight = window.setTimeout(refresh, msUntilTehranMidnight());
    };
    refresh();
    const backup = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(midnight);
      window.clearInterval(backup);
    };
  }, []);

  const lines = now ? linesFor(now) : [
    { key: "shamsi", label: "شمسی", value: "…" },
    { key: "qamari", label: "قمری", value: "…" },
    { key: "miladi", label: "میلادی", value: "…" },
  ];

  return (
    <div className="keep-contrast w-fit rounded-2xl border border-[#c9a227]/35 bg-black/60 px-3.5 py-2.5 text-white shadow-lg backdrop-blur">
      <p className="text-[10px] font-bold tracking-wide text-[#c9a227]">امروز</p>
      <dl className="mt-1 space-y-1">
        {lines.map((line) => (
          <div key={line.key} className="flex items-baseline gap-2">
            <dt className="w-10 shrink-0 text-[10px] text-[#14a3a2]">{line.label}</dt>
            <dd className="text-xs font-bold leading-5 sm:text-[13px]">{line.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
