"use client";

import { useEffect, useState } from "react";
import { msUntilTehranMidnight } from "@/lib/jalali";

type DateParts = { weekday: string; day: string; month: string; year: string };

const EMPTY: DateParts = { weekday: "—", day: "—", month: "—", year: "" };

function partsFor(calendar: string, now: Date): DateParts {
  const parts = new Intl.DateTimeFormat(`fa-IR-u-ca-${calendar}`, {
    timeZone: "Asia/Tehran",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return { weekday: get("weekday"), day: get("day"), month: get("month"), year: get("year") };
}

/** تاریخ ریز هدر. نیمه‌شب به وقت تهران خودش عوض می‌شود. */
export default function TodayDates() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let midnight = 0;
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

  const shamsi = now ? partsFor("persian", now) : EMPTY;
  const qamari = now ? partsFor("islamic-umalqura", now) : EMPTY;
  const miladi = now ? partsFor("gregory", now) : EMPTY;

  return (
    <div className="header-dates" aria-label="تاریخ امروز" aria-live="polite">
      <p>
        <span>{shamsi.weekday}</span>
        <span className="header-dates-day">{shamsi.day}</span>
        <strong>{shamsi.month} {shamsi.year}</strong>
      </p>
      <span className="header-dates-sep" aria-hidden="true" />
      <p>
        <span className="header-dates-label">قمری</span>
        <strong>{qamari.day} {qamari.month} {qamari.year}</strong>
      </p>
      <span className="header-dates-sep" aria-hidden="true" />
      <p>
        <span className="header-dates-label">میلادی</span>
        <strong>{miladi.day} {miladi.month} {miladi.year}</strong>
      </p>
    </div>
  );
}
