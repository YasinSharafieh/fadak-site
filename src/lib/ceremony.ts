import { parsePersianDate, toPersianDigits } from "@/lib/jalali";

const MONTHS = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
const MONTH_SLUG = ["farvardin", "ordibehesht", "khordad", "tir", "mordad", "shahrivar", "mehr", "aban", "azar", "dey", "bahman", "esfand"];

export type CeremonyPhoto = {
  event_id?: string | null;
  url?: string | null;
  caption?: string | null;
  created_at?: string | null;
};

/** تاریخ کوتاه همان مراسم، مثل «۱۲ آبان ۱۴۰۵». خالی اگر تاریخ قابل‌خواندن نباشد. */
export function shortPersianDate(dateFa: string) {
  const parsed = parsePersianDate(dateFa || "");
  if (!parsed || !parsed.m) return (dateFa || "").trim();
  const month = MONTHS[parsed.m - 1] || "";
  const year = parsed.y ? ` ${toPersianDigits(parsed.y)}` : "";
  return `${toPersianDigits(parsed.d)} ${month}${year}`.trim();
}

/** آدرس مراسم همیشه لاتین است. اسلاگ فارسی صفحه را خالی می‌کند. */
export function englishCeremonySlug(dateFa: string) {
  const parsed = parsePersianDate(dateFa || "");
  const month = parsed?.m ? MONTH_SLUG[parsed.m - 1] : "";
  if (parsed?.d && month) return `majles-${parsed.d}-${month}`;
  return `majles-${Date.now()}`;
}

/** عنوان کارت. اگر تاریخ داخل عنوان نباشد، تاریخ خود همان مراسم به آن اضافه می‌شود. */
export function ceremonyCardTitle(title: string, dateFa: string) {
  const clean = (title || "مراسم").replace(/\u200c/g, " ").replace(/\s+/g, " ").trim();
  if (MONTHS.some((month) => clean.includes(month))) return clean;
  const date = shortPersianDate(dateFa);
  return date ? `${clean} – ${date}` : clean;
}

/**
 * برای هر مراسم یک عکس ثابت از عکس‌های همان مراسم.
 * اولین عکس (قدیمی‌ترین) انتخاب می‌شود تا با رفرش کاور عوض نشود.
 * poster_url اگر باشد، در خود کارت بر این مقدار اولویت دارد.
 */
export function coverByEvent(photos: CeremonyPhoto[]) {
  const covers: Record<string, string> = {};
  const sorted = [...photos].sort((a, b) => (a.created_at || "").localeCompare(b.created_at || ""));
  for (const photo of sorted) {
    const eventId = photo.event_id || "";
    const url = photo.url || "";
    if (!eventId || !url || covers[eventId]) continue;
    if ((photo.caption || "").includes("ویدیو")) continue;
    covers[eventId] = url;
  }
  return covers;
}
