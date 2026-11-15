"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { collections } from "@/data/mock";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, vi] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }).limit(8),
          supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(8),
        ]);
        setEvents(ev.data || []);
        setVideos(vi.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* بنر اطلاعیه — عین نوریه */}
      <section className="relative bg-[#0B3D2E]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
          <div className="text-center text-[#F7F3E8]">
            <span className="text-sm font-medium text-[#C9A227]">اطلاعیه</span>
            <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">مجلس روضه هفتگی</h1>
            <p className="mt-3 text-white/80">سه‌شنبه ۲۱ آبان ۱۴۰۵ — حسینیه سیدالشهدا (ع)</p>
            <Link href="/archive" className="mt-6 inline-block rounded-full bg-[#C9A227] px-8 py-3 font-bold text-[#0B3D2E] hover:bg-[#e8c766] transition">
              آرشیو مراسمات
            </Link>
          </div>
        </div>
      </section>

      {/* آخرین مراسم‌ها — عین نوریه */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0B3D2E]">آخرین مراسم‌ها</h2>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">جدیدترین مراسم‌های ثبت‌شده در آرشیو فدک را مشاهده و دنبال کنید.</p>
          </div>
          <Link href="/archive" className="shrink-0 text-sm text-[#0E7C7B] hover:underline">همه مراسم‌ها</Link>
        </div>

        <div className="mt-5 flex gap-4 overflow-x-auto pb-3 no-scrollbar">
          {loading ? (
            <p className="text-sm text-[#3D2B1F]/60">در حال بارگذاری...</p>
          ) : events.map((e) => (
            <Link key={e.id} href={`/archive/${e.slug}`} className="group w-80 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              <div className="relative h-48 bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B]">
                <div className="islamic-pattern-dark absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl text-white/90">🕌</span>
                </div>
                <div className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] text-xl font-extrabold text-[#0B3D2E] shadow-lg">ف</div>
              </div>
              <div className="p-4">
                {e.date_hijri && <p className="text-xs text-[#0E7C7B]">{e.date_hijri}</p>}
                <h3 className="mt-1 font-bold leading-6 group-hover:text-[#0E7C7B] transition">{e.title}</h3>
                {e.maddah && <p className="mt-2 text-xs leading-5 text-[#3D2B1F]/70">{e.maddah}</p>}
                <p className="mt-2 text-xs text-[#3D2B1F]/60">{e.date_fa}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-1 text-xs text-[#3D2B1F]/50">برای مشاهده بیشتر بکشید ←</p>
      </section>

      {/* جدیدترین نماهنگ‌ها — عین نوریه */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-[#0E7C7B]">ویدئو</span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0B3D2E]">جدیدترین نماهنگ‌ها</h2>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">جدیدترین نماهنگ‌ها و کلیپ‌های منتشرشده از مراسمات هیئت.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#0E7C7B] hover:underline">همه نماهنگ‌ها</Link>
          </div>

          <div className="mt-5 flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.aparat.com/v/${v.aparat_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-72 shrink-0 overflow-hidden rounded-2xl bg-[#F7F3E8] hover:shadow-md transition"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-4xl text-white/50">🎬</div>
                  )}
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                  <span className="absolute top-2 right-2 rounded bg-[#C9A227] px-2 py-1 text-[10px] font-bold text-[#0B3D2E]">نماهنگ</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5">{v.title}</h3>
                  <p className="mt-1 text-xs text-[#3D2B1F]/60">کربلایی حسین طاهری</p>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-1 text-xs text-[#3D2B1F]/50">برای مشاهده ویدئوهای بیشتر بکشید ←</p>
        </div>
      </section>

      {/* مجموعه‌ها — عین نوریه */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-[#0E7C7B]">آرشیو</span>
            <h2 className="mt-1 text-2xl font-extrabold text-[#0B3D2E]">مجموعه‌ها</h2>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">دسترسی سریع به آرشیو مناسبت‌های مختلف هیئت</p>
          </div>
          <Link href="/collections" className="shrink-0 text-sm text-[#0E7C7B] hover:underline">همه مجموعه‌ها</Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="rounded-full bg-[#0B3D2E] px-6 py-3 font-bold text-white hover:bg-[#0E7C7B] transition"
            >
              {col.name}
            </Link>
          ))}
        </div>
      </section>

      {/* محبوب‌ترین ویدئوها — عین نوریه */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-[#0E7C7B]">ویدئوهای برگزیده</span>
              <h2 className="mt-1 text-2xl font-extrabold text-[#0B3D2E]">محبوب‌ترین ویدئوها</h2>
              <p className="mt-1 text-sm text-[#3D2B1F]/70">ویدئوهای منتخب کانال فدک در آپارات.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#0E7C7B] hover:underline">همه ویدئوها</Link>
          </div>

          <div className="mt-5 flex gap-4 overflow-x-auto pb-3 no-scrollbar">
            {videos.slice(0, 5).map((v) => (
              <a
                key={v.id}
                href={`https://www.aparat.com/v/${v.aparat_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-72 shrink-0 overflow-hidden rounded-2xl bg-[#F7F3E8] hover:shadow-md transition"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] text-4xl text-white/50">🎬</div>
                  )}
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                  <span className="absolute top-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">آپارات</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5">{v.title}</h3>
                </div>
              </a>
            ))}
          </div>
          <p className="mt-1 text-xs text-[#3D2B1F]/50">برای مشاهده ویدئوهای بیشتر بکشید ←</p>
        </div>
      </section>

      {/* حمایت — عین نوریه */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl bg-[#0B3D2E] p-8 md:p-10 text-center text-white">
          <p className="text-sm text-[#C9A227]">یک قدم برای ساختن یک خانه ماندگار</p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">با هم، آینده حسینیه را بسازیم</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/80">
            ساخت حسینیه با همراهی دل‌های مهربان شکل می‌گیرد. چه با کمک در مسیر ساخت‌وساز و چه با اهدای نذورات، سهم شما می‌تواند بخشی از این بنای ماندگار باشد.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/donate" className="rounded-full bg-[#C9A227] px-6 py-3 font-bold text-[#0B3D2E] hover:bg-[#e8c766] transition">مشارکت در ساخت</Link>
            <Link href="/donate" className="rounded-full border border-white/30 px-6 py-3 hover:bg-white/10 transition">اهدای نذورات</Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-white/10 p-4">این بنا، با همراهی شما ساخته می‌شود</div>
            <div className="rounded-2xl bg-white/10 p-4">مشارکت به اندازه توان شما</div>
            <div className="rounded-2xl bg-white/10 p-4">همراهی در یک کار ماندگار</div>
          </div>
        </div>
      </section>

      {/* موقعیت — عین نوریه */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <span className="text-xs font-medium text-[#0E7C7B]">موقعیت حسینیه</span>
            <h2 className="mt-2 text-2xl font-extrabold text-[#0B3D2E]">حسینیه سیدالشهدا (ع)</h2>
            <p className="mt-3 leading-7 text-[#3D2B1F]/80">
              برای حضور در مراسم‌ها و برنامه‌های حسینیه، می‌توانید موقعیت مجموعه را روی نقشه مشاهده کنید.
            </p>
            <div className="mt-4">
              <p className="text-sm font-bold">آدرس</p>
              <p className="mt-1 text-sm leading-6 text-[#3D2B1F]/70">
                تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار
              </p>
            </div>
            <a href="https://www.openstreetmap.org/?mlat=35.725616&mlon=51.445673#map=16/35.725616/51.445673" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-full bg-[#0B3D2E] px-6 py-3 font-bold text-white hover:bg-[#0E7C7B] transition">
              مسیریابی
            </a>
          </div>
          <div className="islamic-pattern flex items-center justify-center rounded-3xl bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B] p-8 text-center text-white">
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
