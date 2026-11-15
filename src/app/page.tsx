"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { hadithOfDay, reels as mockReels } from "@/data/mock";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  date_hijri?: string;
  speaker?: string;
  maddah?: string;
  location?: string;
  status: string;
};

type Audio = {
  id: string;
  title: string;
  file_url: string;
  event_id: string;
};

type Video = {
  id: string;
  title: string;
  aparat_id: string;
  thumbnail?: string;
  duration?: string;
  event_id: string;
};

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-3 justify-center">
      {[
        { value: timeLeft.days, label: "روز" },
        { value: timeLeft.hours, label: "ساعت" },
        { value: timeLeft.minutes, label: "دقیقه" },
        { value: timeLeft.seconds, label: "ثانیه" },
      ].map((item) => (
        <div key={item.label} className="glass-card rounded-2xl px-4 py-3 text-center min-w-[70px]">
          <div className="text-2xl font-extrabold text-[#C9A227]">{item.value}</div>
          <div className="text-xs text-white/70">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [audios, setAudios] = useState<Audio[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, au, vi] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }).limit(6),
          supabase.from("audios").select("*").order("created_at", { ascending: false }).limit(6),
          supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(6),
        ]);
        setEvents(ev.data || []);
        setAudios(au.data || []);
        setVideos(vi.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const nextEvent = events.find((e) => e.status === "upcoming") || events[0];
  const pastEvents = events.filter((e) => e.status === "past").slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* هیرو — نبض زنده فدک */}
      <section className="relative overflow-hidden bg-[#0B3D2E] text-[#F7F3E8]">
        <div className="islamic-pattern-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="text-center">
            <p className="text-sm tracking-widest text-[#C9A227]">حسینیه مجازی هیأت فدائیان حضرت زهرا (س)</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
              فدک؛ خانه دیجیتال
              <br />
              <span className="text-[#C9A227]">کربلایی حسین طاهری</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl leading-8 text-white/80">
              آرشیو زنده و مرجع دیجیتال آثار — صوت، ویدیو، نماهنگ، ریلز، عکس و اشعار. هر مراسم یک آلبوم زنده، هر اثر یک شیء دیجیتال قابل جستجو.
            </p>
          </div>

          {/* مراسم بعدی با شمارش معکوس */}
          {nextEvent && (
            <div className="mx-auto mt-12 max-w-3xl">
              <div className="glass-card rounded-3xl p-6 md:p-8 text-center">
                <p className="text-xs tracking-widest text-[#C9A227]">مراسم بعدی</p>
                <h2 className="mt-2 text-2xl font-extrabold">{nextEvent.title}</h2>
                <p className="mt-2 text-white/80">{nextEvent.date_fa} {nextEvent.date_hijri && `| ${nextEvent.date_hijri}`}</p>
                {nextEvent.speaker && <p className="mt-1 text-sm text-white/70">سخنران: {nextEvent.speaker}</p>}
                {nextEvent.maddah && <p className="mt-1 text-sm text-white/70">مداحان: {nextEvent.maddah}</p>}
                <div className="mt-6">
                  <CountdownTimer targetDate={nextEvent.date_fa} />
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link href={`/archive/${nextEvent.slug}`} className="btn-gold rounded-full px-6 py-3">
                    جزئیات مراسم
                  </Link>
                  <Link href="/events" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">
                    همه مراسم‌ها
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* دکمه‌های سریع */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/archive" className="btn-green rounded-full px-6 py-3">آرشیو مراسم</Link>
            <Link href="/audio" className="rounded-full border border-[#C9A227]/60 px-6 py-3 text-[#C9A227] hover:bg-[#C9A227]/10 transition">کتابخانه صوتی</Link>
            <Link href="/reels" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">ریلز فدک</Link>
            <Link href="/link" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">صفحات حسین طاهری</Link>
          </div>
        </div>
      </section>

      {/* حدیث روز */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="paper-texture gold-frame rounded-3xl bg-white p-8 md:p-10 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">حدیث روز</h2>
            <span className="rounded-full bg-[#0B3D2E] px-3 py-1 text-xs text-[#F7F3E8]">خودکار هر روز</span>
          </div>
          <p className="mt-6 text-center text-2xl font-bold leading-10 text-[#0B3D2E]">{hadithOfDay.text}</p>
          <p className="mt-3 text-center text-lg leading-8">{hadithOfDay.translation}</p>
          <p className="mt-3 text-center text-sm text-[#3D2B1F]/70">{hadithOfDay.source}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="rounded-full border px-4 py-2 text-sm hover:bg-[#F7F3E8] transition">اشتراک‌گذاری</button>
            <Link href="/poems" className="rounded-full border px-4 py-2 text-sm hover:bg-[#F7F3E8] transition">آرشیو احادیث</Link>
          </div>
        </div>
      </section>

      {/* آخرین آثار */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#0B3D2E]">آخرین آثار</h2>
          <Link href="/archive" className="text-sm font-bold text-[#0E7C7B] hover:underline">مشاهده همه ←</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {audios.slice(0, 3).map((a) => (
            <div key={a.id} className="card-hover gold-frame rounded-2xl bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3D2E] text-xl text-white">🎵</div>
                <div className="flex-1">
                  <h3 className="font-bold leading-6">{a.title}</h3>
                  <p className="text-xs text-[#3D2B1F]/60">صوت</p>
                </div>
              </div>
              <audio controls className="mt-4 w-full" src={a.file_url} />
            </div>
          ))}
          {videos.slice(0, 3).map((v) => (
            <Link key={v.id} href={`https://www.aparat.com/v/${v.aparat_id}`} target="_blank" className="card-hover overflow-hidden rounded-2xl bg-white shadow">
              <div className="relative aspect-video bg-black">
                {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-2xl text-white">▶</span>
                </span>
                {v.duration && <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold leading-6">{v.title}</h3>
                <p className="mt-1 text-xs text-[#3D2B1F]/60">ویدیو آپارات</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* مراسم‌های اخیر */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#0B3D2E]">مراسم‌های اخیر</h2>
          <Link href="/archive" className="text-sm font-bold text-[#0E7C7B] hover:underline">مشاهده همه ←</Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((e) => (
            <Link key={e.id} href={`/archive/${e.slug}`} className="card-hover overflow-hidden rounded-2xl bg-white shadow">
              <div className="islamic-pattern flex h-40 items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-5xl text-white/90">🕌</div>
              <div className="p-5">
                <h3 className="font-bold">{e.title}</h3>
                <p className="mt-1 text-sm text-[#3D2B1F]/70">{e.date_fa}</p>
                {e.maddah && <p className="mt-1 text-xs text-[#3D2B1F]/60">{e.maddah}</p>}
                <span className="mt-3 inline-block text-sm font-bold text-[#0E7C7B]">مشاهده جلسه ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ریلز */}
      <section className="bg-[#0B3D2E] py-12 text-[#F7F3E8]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">ریلزهای فدک</h2>
            <Link href="/reels" className="text-sm text-[#C9A227] hover:underline">همه ریلزها ←</Link>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {mockReels.map((r) => (
              <Link key={r.id} href={`/reels/${r.id}`} className="w-44 shrink-0 overflow-hidden rounded-2xl bg-white/10 card-hover">
                <div className="flex h-64 items-center justify-center bg-gradient-to-b from-[#0E7C7B] to-[#0B3D2E] text-5xl">▶</div>
                <div className="p-3">
                  <div className="text-sm font-bold leading-5">{r.title}</div>
                  <div className="mt-1 text-xs text-white/60">{r.duration}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* خدمات */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/khadam" className="card-hover gold-frame rounded-2xl bg-white p-8 text-center">
            <div className="text-4xl">🤝</div>
            <div className="mt-3 text-lg font-extrabold">ثبت‌نام خادمین</div>
            <p className="mt-2 text-sm text-[#3D2B1F]/70">برای خدمت در هیئت ثبت‌نام کنید</p>
          </Link>
          <Link href="/donate" className="card-hover gold-frame rounded-2xl bg-white p-8 text-center">
            <div className="text-4xl">❤️</div>
            <div className="mt-3 text-lg font-extrabold">کمک به هیئت</div>
            <p className="mt-2 text-sm text-[#3D2B1F]/70">حمایت مالی از مراسم‌ها</p>
          </Link>
          <Link href="https://gharaar.net" target="_blank" className="card-hover gold-frame rounded-2xl bg-white p-8 text-center">
            <div className="text-4xl">🚐</div>
            <div className="mt-3 text-lg font-extrabold">قرار بی‌قرارها</div>
            <p className="mt-2 text-sm text-[#3D2B1F]/70">کاروان وابسته به فدک</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
