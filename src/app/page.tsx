import Link from "next/link";
import { upcomingEvents, pastEvents, hadithOfDay, reels } from "@/data/mock";

export default function Home() {
  return (
    <div>
      {/* هیرو */}
      <section className="bg-[#0B3D2E] text-[#F7F3E8]">
        <div className="islamic-pattern-dark">
          <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">
            <div className="gold-frame rounded-3xl bg-white/5 p-6 md:p-10">
              <p className="text-sm text-[#C9A227]">حسینیه مجازی هیأت فدائیان حضرت زهرا (س)</p>
              <h1 className="mt-3 text-3xl font-extrabold leading-snug md:text-5xl">
                پایگاه حفظ و نشر آثار
                <br />
                کربلایی حسین طاهری
              </h1>
              <p className="mt-4 max-w-2xl leading-8 text-white/80">
                مراسم آینده، آرشیو کامل مراسم‌های گذشته، صوت، تصویر، نماهنگ، متن اشعار، ریلزهای فدک و حدیث روز — همه در یک رسانه جامع و شکیل.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/events" className="rounded-full bg-[#C9A227] px-6 py-3 font-bold text-[#0B3D2E]">
                  مراسم آینده
                </Link>
                <Link href="/archive" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10">
                  آرشیو مراسم
                </Link>
                <Link href="/link" className="rounded-full border border-[#C9A227]/60 px-6 py-3 text-[#C9A227]">
                  صفحات حسین طاهری
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* حدیث روز */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="paper-texture gold-frame rounded-3xl bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">حدیث روز</h2>
            <span className="rounded-full bg-[#0B3D2E] px-3 py-1 text-xs text-[#F7F3E8]">خودکار هر روز</span>
          </div>
          <p className="mt-4 text-center text-2xl font-bold leading-10 text-[#0B3D2E]">{hadithOfDay.text}</p>
          <p className="mt-2 text-center text-lg">{hadithOfDay.translation}</p>
          <p className="mt-2 text-center text-sm text-[#3D2B1F]/70">{hadithOfDay.source}</p>
        </div>
      </section>

      {/* مراسم آینده */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#0B3D2E]">مراسم آینده</h2>
          <Link href="/events" className="text-sm font-bold text-[#0E7C7B]">مشاهده همه ←</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {upcomingEvents.map((e) => (
            <article key={e.id} className="gold-frame rounded-2xl bg-white p-5">
              <h3 className="text-lg font-bold">{e.title}</h3>
              <p className="mt-2 text-sm text-[#3D2B1F]/80">{e.dateFa} | {e.dateHijri}</p>
              <p className="mt-1 text-sm">مداح: {e.maddah}</p>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">{e.location}</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/events/${e.id}`} className="rounded-full bg-[#0B3D2E] px-4 py-2 text-sm text-white">جزئیات و مسیریابی</Link>
                <Link href="/donate" className="rounded-full border px-4 py-2 text-sm">کمک به هیئت</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* آخرین مراسم‌ها */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#0B3D2E]">آخرین مراسم‌ها</h2>
          <Link href="/archive" className="text-sm font-bold text-[#0E7C7B]">مشاهده همه ←</Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((e) => (
            <article key={e.id} className="overflow-hidden rounded-2xl bg-white shadow">
              <div className="islamic-pattern flex h-36 items-center justify-center bg-[#0E7C7B] text-4xl text-white/90">🕌</div>
              <div className="p-4">
                <h3 className="font-bold">{e.title}</h3>
                <p className="mt-1 text-xs text-[#3D2B1F]/70">{e.dateFa}</p>
                <Link href={`/archive/${e.id}`} className="mt-3 inline-block text-sm font-bold text-[#0E7C7B]">مشاهده جلسه ←</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ریلز */}
      <section className="bg-[#0B3D2E] py-10 text-[#F7F3E8]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">ریلزهای فدک</h2>
            <Link href="/reels" className="text-sm text-[#C9A227]">همه ریلزها ←</Link>
          </div>
          <div className="mt-5 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {reels.map((r) => (
              <Link key={r.id} href={`/reels/${r.id}`} className="w-44 shrink-0 overflow-hidden rounded-2xl bg-white/10">
                <div className="flex h-64 items-center justify-center bg-gradient-to-b from-[#0E7C7B] to-[#0B3D2E] text-5xl">▶</div>
                <div className="p-3">
                  <div className="text-sm font-bold">{r.title}</div>
                  <div className="text-xs text-white/60">{r.duration}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* خدمات */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/khadam" className="gold-frame rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl">🤝</div>
            <div className="mt-2 font-extrabold">ثبت‌نام خادمین</div>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">برای خدمت در هیئت ثبت‌نام کنید</p>
          </Link>
          <Link href="/donate" className="gold-frame rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl">❤️</div>
            <div className="mt-2 font-extrabold">کمک به هیئت</div>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">حمایت مالی از مراسم‌ها</p>
          </Link>
          <Link href="https://gharaar.net" target="_blank" className="gold-frame rounded-2xl bg-white p-6 text-center">
            <div className="text-3xl">🚐</div>
            <div className="mt-2 font-extrabold">قرار بی‌قرارها</div>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">کاروان وابسته به فدک</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
