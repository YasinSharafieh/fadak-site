const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"] as const;
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

const TEHRAN_WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** تاریخ و ساعت تقویمی تهران، مستقل از منطقهٔ زمانی سرور. */
export function tehranParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "0";
  return {
    y: Number(get("year")),
    m: Number(get("month")),
    d: Number(get("day")),
    weekday: TEHRAN_WEEKDAY[get("weekday")] ?? 0,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

export function tehranDateKey(now = new Date()) {
  const t = tehranParts(now);
  return `${t.y}-${t.m}-${t.d}`;
}

/** میلی‌ثانیه تا ساعت ۰۰:۰۰ به وقت تهران، کمی بعد از نیمه‌شب تا تاریخ جدید قطعی باشد. */
export function msUntilTehranMidnight(now = new Date()) {
  const t = tehranParts(now);
  if (t.hour >= 24) return 40;
  const elapsed = ((t.hour * 60 + t.minute) * 60 + t.second) * 1000 + now.getMilliseconds();
  const day = 24 * 60 * 60 * 1000;
  const remain = day - elapsed;
  if (remain <= 0 || remain > day) return 40;
  return remain + 40;
}

/** روضه هفتگی فدک هر سه‌شنبه است. اگر امروز سه‌شنبه باشد، همان امروز اعلام می‌شود. */
export function nextWeeklyMajles(now = new Date()): NextMajles {
  const t = tehranParts(now);
  const tuesday = 2;
  const add = (tuesday - t.weekday + 7) % 7;
  const next = new Date(Date.UTC(t.y, t.m - 1, t.d + add));
  const j = gregorianToJalali(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
  const weekday = "سه‌شنبه";
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
