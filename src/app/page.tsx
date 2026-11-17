"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { collections } from "@/data/mock";
import CarouselRow from "@/components/CarouselRow";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  date_hijri?: string;
  maddah?: string;
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
  const [namahang, setNamahang] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, vi, nm] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }).limit(8),
          supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(8),
          supabase.from("videos").select("*").ilike("title", "%نماهنگ%").order("created_at", { ascending: false }).limit(10),
        ]);
        setEvents(ev.data || []);
        setVideos(vi.data || []);
        setNamahang(nm.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* بنر اطلاعیه */}
      <section className="relative bg-black">
        <div className="islamic-pattern-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center text-white">
          <span className="text-sm font-medium text-[#14a3a2]">اطلاعیه</span>
          <h1 className="mt-3 text-3xl font-extrabold md:text-5xl">مجلس روضه هفتگی</h1>
          <p className="mt-3 text-white/70">سه‌شنبه ۲۱ آبان ۱۴۰۵ — حسینیه سیدالشهدا (ع)</p>
          <Link href="/archive" className="btn-green mt-6 inline-block rounded-full px-8 py-3">
            آرشیو مراسمات
          </Link>
        </div>
      </section>

      {/* آخرین مراسم‌ها */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">آخرین مراسم‌ها</h2>
            <p className="mt-1 text-sm text-white/60">جدیدترین مراسم‌های ثبت‌شده در آرشیو فدک را مشاهده و دنبال کنید.</p>
          </div>
          <Link href="/archive" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه مراسم‌ها</Link>
        </div>

        <CarouselRow className="mt-5 gap-4">
          {loading ? (
            <p className="text-sm text-white/50">در حال بارگذاری...</p>
          ) : events.map((e) => (
            <Link key={e.id} href={`/archive/${e.slug}`} className="card-hover group w-80 shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5">
              <div className="relative h-48 bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b]">
                <div className="islamic-pattern-dark absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl text-white/20">🕌</span>
                </div>
                <div className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a227] text-xl font-extrabold text-[#0b3d2e] shadow-lg">ف</div>
              </div>
              <div className="p-4">
                {e.date_hijri && <p className="text-xs text-[#14a3a2]">{e.date_hijri}</p>}
                <h3 className="mt-1 font-bold leading-6 group-hover:text-[#14a3a2] transition">{e.title}</h3>
                {e.maddah && <p className="mt-2 text-xs leading-5 text-white/60">{e.maddah}</p>}
                <p className="mt-2 text-xs text-white/50">{e.date_fa}</p>
              </div>
            </Link>
          ))}
        </CarouselRow>
        <p className="mt-1 text-xs text-white/40">برای مشاهده بیشتر بکشید ←</p>
      </section>

      {/* جدیدترین نماهنگ‌ها — با افکت هاور عریض شدن */}
      <section className="bg-[#111111] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#14a3a2]">ویدئو</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">جدیدترین نماهنگ‌ها</h2>
              <p className="mt-1 text-sm text-white/60">جدیدترین نماهنگ‌ها و کلیپ‌های منتشرشده از مراسمات هیئت.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه نماهنگ‌ها</Link>
          </div>

          <CarouselRow className="mt-5">
            {namahang.map((v) => (
              <Link
                key={v.id}
                href={`/videos/${v.id}`}
                className="group relative w-64 shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 transition-all duration-500 hover:w-80 hover:border-[#0e7c7b]/50"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-4xl text-white/20">🎬</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0e7c7b] text-2xl text-white shadow-2xl">▶</span>
                  </span>
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                  <span className="absolute top-2 right-2 rounded bg-[#0e7c7b] px-2 py-1 text-[10px] font-bold text-white">نماهنگ</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5 group-hover:text-[#14a3a2] transition">{v.title}</h3>
                  <p className="mt-1 text-xs text-white/50">کربلایی حسین طاهری</p>
                </div>
              </Link>
            ))}
          </CarouselRow>
          <p className="mt-1 text-xs text-white/40">برای مشاهده ویدئوهای بیشتر بکشید ←</p>
        </div>
      </section>

      {/* مجموعه‌ها */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-[#14a3a2]">آرشیو</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white">مجموعه‌ها</h2>
            <p className="mt-1 text-sm text-white/60">دسترسی سریع به آرشیو مناسبت‌های مختلف هیئت</p>
          </div>
          <Link href="/collections" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه مجموعه‌ها</Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="rounded-full bg-[#1a1a1a] px-6 py-3 font-bold text-white hover:bg-[#0e7c7b] hover:scale-105 transition border border-white/10"
            >
              {col.name}
            </Link>
          ))}
        </div>
      </section>

      {/* محبوب‌ترین ویدئوها */}
      <section className="bg-[#111111] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#14a3a2]">ویدئوهای برگزیده</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">محبوب‌ترین ویدئوها</h2>
              <p className="mt-1 text-sm text-white/60">ویدئوهای منتخب کانال فدک در آپارات.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه ویدئوها</Link>
          </div>

          <CarouselRow className="mt-5">
            {videos.slice(0, 5).map((v) => (
              <Link
                key={v.id}
                href={`/videos/${v.id}`}
                className="group relative w-64 shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5 transition-all duration-500 hover:w-80 hover:border-[#0e7c7b]/50"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-4xl text-white/20">🎬</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0e7c7b] text-2xl text-white shadow-2xl">▶</span>
                  </span>
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                  <span className="absolute top-2 right-2 rounded bg-black/80 px-2 py-1 text-[10px] text-white">آپارات</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5 group-hover:text-[#14a3a2] transition">{v.title}</h3>
                </div>
              </Link>
            ))}
          </CarouselRow>
          <p className="mt-1 text-xs text-white/40">برای مشاهده ویدئوهای بیشتر بکشید ←</p>
        </div>
      </section>

      {/* حمایت */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-8 md:p-10 text-center text-white">
          <p className="text-sm text-[#c9a227]">یک قدم برای ساختن یک خانه ماندگار</p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">با هم، آینده حسینیه را بسازیم</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/80">
            ساخت حسینیه با همراهی دل‌های مهربان شکل می‌گیرد. چه با کمک در مسیر ساخت‌وساز و چه با اهدای نذورات، سهم شما می‌تواند بخشی از این بنای ماندگار باشد.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/donate" className="btn-gold rounded-full px-6 py-3">مشارکت در ساخت</Link>
            <Link href="/donate" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">اهدای نذورات</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">این بنا، با همراهی شما ساخته می‌شود</div>
            <div className="rounded-2xl bg-white/10 p-4">مشارکت به اندازه توان شما</div>
            <div className="rounded-2xl bg-white/10 p-4">همراهی در یک کار ماندگار</div>
          </div>
        </div>
      </section>

      {/* موقعیت */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-[#1a1a1a] p-8 border border-white/10">
            <span className="text-xs text-[#14a3a2]">موقعیت حسینیه</span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">حسینیه سیدالشهدا (ع)</h2>
            <p className="mt-3 leading-7 text-white/70">
              برای حضور در مراسم‌ها و برنامه‌های حسینیه، می‌توانید موقعیت مجموعه را روی نقشه مشاهده کنید.
            </p>
            <div className="mt-4">
              <p className="text-sm font-bold">آدرس</p>
              <p className="mt-1 text-sm leading-6 text-white/60">
                تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار
              </p>
            </div>
            <a href="https://www.openstreetmap.org/?mlat=35.725616&mlon=51.445673#map=16/35.725616/51.445673" target="_blank" rel="noopener noreferrer" className="btn-green mt-5 inline-block rounded-full px-6 py-3">
              مسیریابی
            </a>
          </div>
          <div className="islamic-pattern flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-8 text-center text-white">
            <div>
              <div className="text-6xl">🕌</div>
              <h3 className="mt-3 text-xl font-extrabold">حسینیه سیدالشهدا (ع)</h3>
              <p className="mt-2 text-sm text-white/70">مراسم‌های روضه هفتگی هر سه‌شنبه برگزار می‌شود</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
