import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CeremonyTabs from "@/components/CeremonyTabs";
import { getAparatVideoInfo } from "@/lib/aparat";
import { fadakMapUrl } from "@/data/mock";

export const instant = false;

async function getEvent(slug: string) {
  if (supabase) {
    const { data } = await supabase.from("events").select("*").eq("slug", slug).single();
    if (data) return data;
  }
  return null;
}

export default async function ArchiveDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);

  const title = event?.title || "مراسم فدک";
  const dateFa = event?.date_fa || "—";
  const dateHijri = event?.date_hijri || "—";
  const maddah = event?.maddah || "کربلایی حسین طاهری";
  const speaker = event?.speaker || "";
  const location = event?.location || "حسینیه سیدالشهدا (ع)، تهران";
  const address = event?.address || "";
  const posterUrl = event?.poster_url || "";
  const mapUrl = event?.map_url || fadakMapUrl;

  let audios: any[] = [];
  let photos: any[] = [];
  let videos: any[] = [];
  if (supabase && event?.id) {
    const [a, p, v] = await Promise.all([
      supabase.from("audios").select("*").eq("event_id", event.id),
      supabase.from("photos").select("*").eq("event_id", event.id),
      supabase.from("videos").select("*").eq("event_id", event.id),
    ]);
    audios = a.data || [];
    photos = p.data || [];
    videos = v.data || [];
  }

  const tgVideos = photos.filter((p) => (p.caption || "").includes("ویدیو"));
  const onlyPhotos = photos.filter((p) => !(p.caption || "").includes("ویدیو"));
  const allVideos = [...videos, ...tgVideos.map((p) => ({ id: p.id, title: p.caption || "ویدیو مراسم", aparat_id: "", thumbnail: p.url }))];

  const freshVideos = await Promise.all(
    allVideos.map(async (v: any) => {
      if (!v.aparat_id) return v;
      const info = await getAparatVideoInfo(v.aparat_id);
      return {
        ...v,
        thumbnail: info.thumbnail || v.thumbnail,
        duration: info.duration || v.duration,
      };
    })
  );

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(`مراسم ${title} - ${maddah}`)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-fade-in">
      <Link href="/archive" className="text-sm text-[#14a3a2] hover:underline">← بازگشت به آرشیو</Link>

      {/* هدر مراسم */}
      <div className="gold-frame mt-4 rounded-3xl bg-[#1a1a1a] p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {posterUrl && (
            <div className="shrink-0">
              <img src={posterUrl} alt="پوستر مراسم" className="w-full md:w-64 rounded-2xl object-cover" />
            </div>
          )}
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
            <p className="mt-3 text-white/70/80">{dateFa} {dateHijri && `| ${dateHijri}`}</p>
            {speaker && <p className="mt-2 text-sm"><span className="font-bold">سخنران:</span> {speaker}</p>}
            <p className="mt-1 text-sm"><span className="font-bold">مداحان:</span> {maddah}</p>
            <p className="mt-1 text-sm text-white/70/70"><span className="font-bold">مکان:</span> {location}</p>
            {address && <p className="mt-1 text-sm text-white/70/70"><span className="font-bold">آدرس:</span> {address}</p>}

            {/* دکمه‌های اقدام */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              {mapUrl && (
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-green rounded-full px-5 py-2 text-sm">
                  🗺️ مسیریابی
                </a>
              )}
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">
                📅 افزودن به تقویم
              </a>
              <a href={`https://t.me/fadak_media_bot`} target="_blank" rel="noopener noreferrer" className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">
                🔔 یادآور تلگرام
              </a>
              <button className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">
                📤 اشتراک‌گذاری
              </button>
            </div>

            {event?.description && (
              <div className="mt-6 whitespace-pre-line rounded-2xl bg-[#111111] p-4 text-right text-sm leading-7">
                {event.description}
              </div>
            )}
          </div>
        </div>
      </div>

      <CeremonyTabs photos={onlyPhotos} audios={audios} videos={freshVideos} />
    </div>
  );
}
