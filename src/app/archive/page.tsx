import Link from "next/link";
import { pastEvents } from "@/data/mock";

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">آرشیو مراسم</h1>
      <p className="mt-2 text-[#3D2B1F]/80">مراسم‌های قبلی به‌صورت تفکیک‌شده و شکیل</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {["همه", "روضه هفتگی", "جشن", "عزاداری", "شهادت", "ولادت"].map((f, i) => (
          <span key={f} className={`rounded-full px-4 py-2 text-sm ${i === 0 ? "bg-[#0B3D2E] text-white" : "bg-white border"}`}>{f}</span>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pastEvents.map((e) => (
          <article key={e.id} className="overflow-hidden rounded-3xl bg-white shadow">
            <div className="islamic-pattern flex h-40 items-center justify-center bg-[#0E7C7B] text-4xl text-white">🕌</div>
            <div className="p-5">
              <h2 className="font-bold">{e.title}</h2>
              <p className="mt-1 text-xs text-[#3D2B1F]/70">{e.dateFa} | {e.dateHijri}</p>
              <p className="mt-1 text-sm">مداح: {e.maddah}</p>
              <Link href={`/archive/${e.id}`} className="mt-3 inline-block text-sm font-bold text-[#0E7C7B]">مشاهده جلسه ←</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
