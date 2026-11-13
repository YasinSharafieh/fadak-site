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
  const location = event?.location || "حسینیه سیدالشهدا (ع)، تهران";

  let audios: any[] = [];
  let photos: any[] = [];
  if (supabase && event?.id) {
    const [a, p] = await Promise.all([
      supabase.from("audios").select("*").eq("event_id", event.id),
      supabase.from("photos").select("*").eq("event_id", event.id),
    ]);
    audios = a.data || [];
    photos = p.data || [];
  }

  const videos = photos.filter((p) => (p.caption || "").includes("ویدیو"));
  const onlyPhotos = photos.filter((p) => !(p.caption || "").includes("ویدیو"));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/archive" className="text-sm text-[#0E7C7B]">← بازگشت به آرشیو</Link>
      <div className="gold-frame mt-4 rounded-3xl bg-white p-8 text-center">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">{title}</h1>
        <p className="mt-2 text-[#3D2B1F]/80">{dateFa} | {dateHijri}</p>
        <p className="mt-1 text-sm">مداح: {maddah} | {location}</p>
      </div>

      <CeremonyTabs photos={onlyPhotos} audios={audios} videos={videos} />
    </div>
  );
}
