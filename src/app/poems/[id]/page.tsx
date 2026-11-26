import Link from "next/link";
import { notFound } from "next/navigation";
import CopyPoem from "@/components/CopyPoem";
import EngageBar from "@/components/EngageBar";
import { supabase } from "@/lib/supabase";

export const instant = false;

export default async function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabase) notFound();

  const { data: poem } = await supabase.from("poems").select("*").eq("id", id).maybeSingle();
  if (!poem) notFound();

  let event: { title?: string; date_fa?: string; slug?: string } | null = null;
  if (poem.event_id) {
    const { data } = await supabase.from("events").select("title,date_fa,slug").eq("id", poem.event_id).maybeSingle();
    event = data;
  }

  const body = String(poem.body || poem.text || "").trim();
  const copyText = [poem.title, event?.date_fa, body].filter(Boolean).join("\n\n");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <Link href={poem.event_id ? `/poems?night=${poem.event_id}` : "/poems"} className="text-sm text-[#14a3a2] hover:underline">
        ← بازگشت به اشعار
      </Link>

      <article className="gold-frame mt-6 rounded-3xl bg-[#1a1a1a] p-6 md:p-10">
        {event?.slug && (
          <Link href={`/archive/${event.slug}`} className="text-sm font-bold text-[#c9a227] hover:underline">
            {event.date_fa} · {event.title}
          </Link>
        )}
        <h1 className="mt-3 text-center text-2xl font-extrabold text-white">{poem.title}</h1>
        {poem.poet && <p className="mt-2 text-center text-sm text-white/60">شاعر: {poem.poet}</p>}

        <div className="poem-text mt-8 whitespace-pre-line text-center text-lg leading-loose text-white/90">{body}</div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <CopyPoem text={copyText} />
          <EngageBar type="poem" id={String(poem.id)} title={String(poem.title || "شعر")} href={`/poems/${poem.id}`} />
        </div>
      </article>
    </div>
  );
}
