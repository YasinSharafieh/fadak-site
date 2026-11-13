import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CeremonyTabs from "@/components/CeremonyTabs";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/archive" className="text-sm text-[#0E7C7B]">← بازگشت به آرشیو</Link>
      <div className="gold-frame mt-4 rounded-3xl bg-white p-8 text-center">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">{title}</h1>
        <p className="mt-2 text-[#3D2B1F]/80">{dateFa} | {dateHijri}</p>
        {speaker && <p className="mt-1 text-sm">سخنران: {speaker}</p>}
        <p className="mt-1 text-sm">مداحان: {maddah}</p>
        <p className="mt-1 text-sm text-[#3D2B1F]/70">{location}</p>
        {event?.description && (
          <div className="mx-auto mt-4 max-w-xl whitespace-pre-line rounded-2xl bg-[#F7F3E8] p-4 text-right text-sm leading-7">
            {event.description}
          </div>
        )}
      </div>

      <CeremonyTabs photos={onlyPhotos} audios={audios} videos={allVideos} />
    </div>
  );
}
