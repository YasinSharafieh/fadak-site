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

/** تاریخ امروز به سه تقویم. نیمه‌شب به وقت تهران خودش عوض می‌شود. */
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
    <aside className="date-plaque keep-contrast" aria-label="تاریخ امروز" aria-live="polite">
      <span className="date-plaque-corner date-plaque-corner-tl" aria-hidden="true" />
      <span className="date-plaque-corner date-plaque-corner-tr" aria-hidden="true" />
      <span className="date-plaque-corner date-plaque-corner-bl" aria-hidden="true" />
      <span className="date-plaque-corner date-plaque-corner-br" aria-hidden="true" />
      <div className="islamic-pattern-dark date-plaque-pattern" aria-hidden="true" />
      <svg className="date-plaque-arch" viewBox="0 0 72 88" aria-hidden="true">
        <path d="M6 88V34C6 14 66 14 66 34V88" />
        <path d="M14 88V38C14 24 58 24 58 38V88" />
      </svg>
      <div className="date-plaque-body">
        <p className="date-plaque-kicker">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0l1.4 4.6L12 6 7.4 7.4 6 12 4.6 7.4 0 6l4.6-1.4z" />
          </svg>
          امروز
        </p>
        <div className="date-plaque-main">
          <p className="date-plaque-day">{shamsi.day}</p>
          <div>
            <p className="date-plaque-weekday">{shamsi.weekday}</p>
            <p className="date-plaque-month">{shamsi.month} {shamsi.year}</p>
            <p className="date-plaque-cal">شمسی</p>
          </div>
        </div>
        <div className="date-plaque-rule" />
        <p className="date-plaque-line">
          <span>قمری</span>
          <strong>{qamari.day} {qamari.month} {qamari.year}</strong>
        </p>
        <p className="date-plaque-line">
          <span>میلادی</span>
          <strong>{miladi.day} {miladi.month} {miladi.year}</strong>
        </p>
      </div>
    </aside>
  );
}
