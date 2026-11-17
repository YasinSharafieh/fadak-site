const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"] as const;
const WEEKDAYS = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"] as const;
const FA = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]);
}

export function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/** تبدیل میلادی به شمسی. اول فروردین ۱۴۰۵ = ۲۱ مارس ۲۰۲۶ را درست برمی‌گرداند. */
export function gregorianToJalali(gy: number, gm: number, gd: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = 979;
  gy -= 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = days < 186 ? 1 + (days % 31) : 1 + ((days - 186) % 30);
  return { jy, jm, jd };
}

export type JalaliDate = { y: number; m: number; d: number };

export function parsePersianDate(input: string): JalaliDate | null {
  const src = normalizeDigits(input || "");
  const found = src.match(/(\d{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  if (!found) return null;
  const year = src.match(/1[34]\d{2}/);
  return {
    y: year ? Number(year[0]) : 0,
    m: MONTHS.indexOf(found[2] as (typeof MONTHS)[number]) + 1,
    d: Number(found[1]),
  };
}

export function comparePersianDates(a: string, b: string) {
  const da = parsePersianDate(a);
  const db = parsePersianDate(b);
  if (!da && !db) return 0;
  if (!da) return 1;
  if (!db) return -1;
  return db.y - da.y || db.m - da.m || db.d - da.d;
}

export type NextMajles = {
  weekday: string;
  day: string;
  month: string;
  year: string;
  label: string;
};

/** روضه هفتگی فدک هر سه‌شنبه است. اگر امروز سه‌شنبه باشد، همان امروز اعلام می‌شود. */
export function nextWeeklyMajles(now = new Date()): NextMajles {
  const date = new Date(now);
  const day = date.getDay();
  const wednesday = 3;
  const add = day === wednesday ? 0 : (wednesday - day + 7) % 7;
  date.setDate(date.getDate() + add);
  const j = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const weekday = WEEKDAYS[date.getDay()];
  const dayText = toPersianDigits(j.jd);
  const yearText = toPersianDigits(j.jy);
  const month = MONTHS[j.jm - 1];
  return {
    weekday,
    day: dayText,
    month,
    year: yearText,
    label: `${weekday} ${dayText} ${month} ${yearText}`,
  };
}

export function artistFromTitle(title: string) {
  const parts = title.split("|").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3) return parts.slice(2).join(" | ");
  if (title.includes("علیرضا")) return "کربلایی علیرضا طاهری";
  return "کربلایی حسین طاهری";
}

export function formatViews(n: number) {
  const text = n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")} هزار` : String(n);
  return `${toPersianDigits(text)} بازدید`;
}
