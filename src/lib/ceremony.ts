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
  if (parsed?.d && month && parsed.y) return `majles-${parsed.d}-${month}-${parsed.y}`;
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

/** اگر چند عکس باشد، ایندکس ۰ (قدیمی‌ترین) انتخاب نمی‌شود. نتیجه برای یک مراسم ثابت است. */
function stablePhotoIndex(eventId: string, count: number) {
  if (count <= 1) return 0;
  let hash = 2166136261;
  for (let i = 0; i < eventId.length; i++) {
    hash ^= eventId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % (count - 1)) + 1;
}

/**
 * جایگزین، فقط وقتی poster_url هنوز قفل نشده.
 * یک عکس از عکس‌های همان مراسم، نه همیشه عکس اول، و در همهٔ صفحه‌ها یکی.
 * poster_url اگر باشد بر این مقدار اولویت دارد و دیگر عوض نمی‌شود.
 */
export function coverByEvent(photos: CeremonyPhoto[]) {
  const grouped = new Map<string, CeremonyPhoto[]>();
  for (const photo of photos) {
    const eventId = photo.event_id || "";
    const url = photo.url || "";
    if (!eventId || !url) continue;
    if ((photo.caption || "").includes("ویدیو")) continue;
    const list = grouped.get(eventId) || [];
    list.push(photo);
    grouped.set(eventId, list);
  }

  const covers: Record<string, string> = {};
  for (const [eventId, list] of grouped) {
    const sorted = [...list].sort(
      (a, b) => (a.created_at || "").localeCompare(b.created_at || "") || (a.url || "").localeCompare(b.url || "")
    );
    const chosen = sorted[stablePhotoIndex(eventId, sorted.length)];
    if (chosen?.url) covers[eventId] = chosen.url;
  }
  return covers;
}
