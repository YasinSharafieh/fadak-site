import Link from "next/link";
import { upcomingEvents } from "@/data/mock";

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">مراسم آینده</h1>
      <p className="mt-2 text-[#3D2B1F]/80">مراسم‌های پیش‌رو با پوستر، آدرس، نقشه و مسیریابی</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {upcomingEvents.map((e) => (
          <article key={e.id} className="gold-frame overflow-hidden rounded-3xl bg-white">
            <div className="islamic-pattern flex h-44 items-center justify-center bg-[#0B3D2E] text-5xl text-[#C9A227]">🕌</div>
            <div className="p-6">
              <h2 className="text-xl font-extrabold">{e.title}</h2>
              <p className="mt-2 text-sm">{e.dateFa} | {e.dateHijri}</p>
              <p className="mt-1 text-sm">مداح: {e.maddah}</p>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">{e.location}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location)}`} target="_blank" rel="noreferrer" className="rounded-full bg-[#0B3D2E] px-4 py-2 text-sm text-white">مسیریابی</a>
                <Link href="/donate" className="rounded-full border px-4 py-2 text-sm">کمک به هیئت</Link>
                <button className="rounded-full border px-4 py-2 text-sm">افزودن به تقویم</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
