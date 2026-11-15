"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { hadithOfDay, collections } from "@/data/mock";

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

type Video = {
  id: string;
  title: string;
  aparat_id: string;
  thumbnail?: string;
  duration?: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, vi] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }).limit(6),
          supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(6),
        ]);
        setEvents(ev.data || []);
        setVideos(vi.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const latestEvents = events.slice(0, 4);
  const latestVideos = videos.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* بنر اطلاعیه — مثل نوریه */}
      <section className="bg-[#0B3D2E] text-[#F7F3E8]">
        <div className="islamic-pattern-dark">
          <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
            <div className="text-center">
              <span className="inline-block rounded-full bg-[#C9A227] px-4 py-1 text-xs font-bold text-[#0B3D2E]">اطلاعیه</span>
              <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">مجلس روضه هفتگی</h1>
              <p className="mt-3 text-white/80">سه‌شنبه‌ها ساعت ۱۹:۳۰ — حسینیه سیدالشهدا (ع)</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/events" className="btn-gold rounded-full px-6 py-3">مراسم آینده</Link>
                <Link href="/archive" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">آرشیو مراسم</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* آخرین مراسم‌ها — مثل نوریه */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B3D2E]">آخرین مراسم‌ها</h2>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">جدیدترین مراسم‌های ثبت‌شده در آرشیو فدک</p>
          </div>
          <Link href="/archive" className="text-sm font-bold text-[#0E7C7B] hover:underline">همه مراسم‌ها ←</Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-center text-[#3D2B1F]/60">در حال بارگذاری...</p>
          ) : latestEvents.length === 0 ? (
            <p className="col-span-full text-center text-[#3D2B1F]/60">مراسمی یافت نشد.</p>
          ) : (
            latestEvents.map((e) => (
              <Link key={e.id} href={`/archive/${e.slug}`} className="card-hover group overflow-hidden rounded-2xl bg-white shadow">
                <div className="islamic-pattern relative flex h-48 items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B]">
                  <span className="text-6xl text-white/90">🕌</span>
                  {e.date_hijri && (
                    <span className="absolute top-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                      {e.date_hijri}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold leading-6 group-hover:text-[#0E7C7B] transition">{e.title}</h3>
                  {e.maddah && <p className="mt-2 text-xs leading-5 text-[#3D2B1F]/70">{e.maddah}</p>}
                  <p className="mt-2 text-xs text-[#3D2B1F]/60">{e.date_fa}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* جدیدترین نماهنگ‌ها — مثل نوریه */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0B3D2E]">جدیدترین نماهنگ‌ها</h2>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">جدیدترین نماهنگ‌ها و کلیپ‌های منتشرشده</p>
            </div>
            <Link href="/videos" className="text-sm font-bold text-[#0E7C7B] hover:underline">همه نماهنگ‌ها ←</Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestVideos.map((v) => (
              <a
                key={v.id}
                href={`https://www.aparat.com/v/${v.aparat_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-hover group overflow-hidden rounded-2xl bg-[#F7F3E8]"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-4xl text-white/50">🎬</div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-xl text-white transition group-hover:bg-[#C9A227] group-hover:text-[#0B3D2E]">▶</span>
                  </span>
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5">{v.title}</h3>
                  <p className="mt-1 text-xs text-[#3D2B1F]/60">کربلایی حسین طاهری</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* مجموعه‌ها — مثل نوریه */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B3D2E]">مجموعه‌ها</h2>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">دسترسی سریع به آرشیو مناسبت‌های مختلف</p>
          </div>
          <Link href="/collections" className="text-sm font-bold text-[#0E7C7B] hover:underline">همه مجموعه‌ها ←</Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.slice(0, 6).map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="card-hover rounded-2xl bg-[#0B3D2E] p-6 text-center text-white"
            >
              <div className="text-3xl">🕌</div>
              <div className="mt-2 font-extrabold">{col.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* حدیث روز */}
      <section className="bg-[#F7F3E8] py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="paper-texture gold-frame rounded-3xl bg-white p-8 text-center">
            <span className="inline-block rounded-full bg-[#0B3D2E] px-4 py-1 text-xs text-[#F7F3E8]">حدیث روز</span>
            <p className="mt-6 text-2xl font-bold leading-10 text-[#0B3D2E]">{hadithOfDay.text}</p>
            <p className="mt-3 text-lg">{hadithOfDay.translation}</p>
            <p className="mt-2 text-sm text-[#3D2B1F]/70">{hadithOfDay.source}</p>
          </div>
        </div>
      </section>

      {/* حمایت */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-3xl bg-[#0B3D2E] p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl font-extrabold">با هم، آینده حسینیه را بسازیم</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80 leading-7">
            ساخت حسینیه با همراهی دل‌های مهربان شکل می‌گیرد. چه با کمک در مسیر ساخت‌وساز و چه با اهدای نذورات، سهم شما می‌تواند بخشی از این بنای ماندگار باشد.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/donate" className="btn-gold rounded-full px-6 py-3">مشارکت در ساخت</Link>
            <Link href="/khadam" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">ثبت‌نام خادم</Link>
          </div>
        </div>
      </section>

      {/* موقعیت */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B3D2E]">موقعیت حسینیه</h2>
            <p className="mt-3 leading-7 text-[#3D2B1F]/80">
              تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار، حسینیه سیدالشهدا (ع)
            </p>
            <a href="https://www.openstreetmap.org/?mlat=35.725616&mlon=51.445673#map=16/35.725616/51.445673" target="_blank" rel="noopener noreferrer" className="btn-green mt-4 inline-block rounded-full px-6 py-3">
              🗺️ مسیریابی
            </a>
          </div>
          <div className="rounded-2xl bg-[#0B3D2E] p-8 text-center text-white">
            <div className="text-5xl">🕌</div>
            <h3 className="mt-3 text-xl font-extrabold">حسینیه سیدالشهدا (ع)</h3>
            <p className="mt-2 text-sm text-white/70">مراسم‌های روضه هفتگی هر سه‌شنبه برگزار می‌شود</p>
          </div>
        </div>
      </section>
    </div>
  );
}
