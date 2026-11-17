"use client";

import { useTehranNow } from "@/lib/useTehranNow";

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

/** تاریخ ریز هدر. هر سه تقویم با هم، ساعت ۰۰:۰۰ به وقت تهران عوض می‌شوند. */
export default function TodayDates() {
  const now = useTehranNow();
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
        <strong>{qamari.day} {qamari.month} {qamari.year}</strong>
      </p>
      <span className="header-dates-sep" aria-hidden="true" />
      <p>
        <strong>{miladi.day} {miladi.month} {miladi.year}</strong>
      </p>
    </div>
  );
}
