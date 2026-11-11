import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AudioPlayer from "@/components/AudioPlayer";

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/archive" className="text-sm text-[#0E7C7B]">← بازگشت به آرشیو</Link>
      <div className="gold-frame mt-4 rounded-3xl bg-white p-8">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">{title}</h1>
        <p className="mt-2 text-[#3D2B1F]/80">{dateFa} | {dateHijri}</p>
        <p className="mt-1 text-sm">مداح: {maddah} | {location}</p>
        {event?.description && <p className="mt-4 leading-8">{event.description}</p>}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-[#0B3D2E]">صوت‌های مراسم</h2>
        <div className="mt-4 space-y-3">
          {audios.length === 0 && <p className="text-sm text-[#3D2B1F]/60">هنوز صوتی برای این مراسم ثبت نشده. از پنل مدیریت اضافه کنید.</p>}
          {audios.map((a) => (
            <AudioPlayer key={a.id} title={a.title} src={a.file_url} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-[#0B3D2E]">گالری تصاویر</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.length === 0 && <p className="text-sm text-[#3D2B1F]/60">هنوز عکسی ثبت نشده.</p>}
          {photos.map((p) => (
            <img key={p.id} src={p.url} alt={p.caption || title} className="aspect-square w-full rounded-2xl object-cover" />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-[#0B3D2E]">ویدیو و نماهنگ</h2>
        <p className="mt-2 text-sm text-[#3D2B1F]/70">ویدیوهای این مراسم از آپارات نمایش داده می‌شوند.</p>
        <a href="https://www.aparat.com" target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full bg-[#0B3D2E] px-5 py-2 text-sm text-white">مشاهده در آپارات ←</a>
      </section>
    </div>
  );
}
