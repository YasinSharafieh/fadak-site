"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { collections, fadakAddress, fadakMapEmbed, fadakMapUrl } from "@/data/mock";
import { popularIds, popularViews } from "@/data/popular-videos";
import CarouselRow from "@/components/CarouselRow";
import SectionSkeleton from "@/components/SectionSkeleton";
import EngageBar from "@/components/EngageBar";
import CeremonyCard from "@/components/CeremonyCard";
import HeroSlides from "@/components/HeroSlides";
import ThemeImage from "@/components/ThemeImage";
import ReelRail from "@/components/ReelRail";
import ReelShelf from "@/components/ReelShelf";
import { ceremonyCardTitle, coverByEvent, shortPersianDate } from "@/lib/ceremony";
import { artistFromTitle, comparePersianDates, formatViews, nextWeeklyMajles, toPersianDigits, type NextMajles } from "@/lib/jalali";
import { useTehranNow } from "@/lib/useTehranNow";

type Event = {
  id: string;
  title: string;
  slug: string;
  date_fa: string;
  date_hijri?: string;
  maddah?: string;
  poster_url?: string;
  status: string;
};

type Video = {
  id: string;
  title: string;
  aparat_id: string;
  thumbnail?: string;
  duration?: string;
  created_at?: string;
};

const collectionStyle: Record<string, { mark: string; from: string; to: string }> = {
  fatimieh: { mark: "فا", from: "#0b3d2e", to: "#0e7c7b" },
  moharam: { mark: "مح", from: "#1a1a1a", to: "#3a1d1d" },
  safar: { mark: "صف", from: "#1a1a1a", to: "#243044" },
  ramadan: { mark: "رم", from: "#0b3d2e", to: "#145c45" },
  weekly: { mark: "هف", from: "#0e7c7b", to: "#0b3d2e" },
  occasions: { mark: "من", from: "#1a1a1a", to: "#3a3214" },
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [namahang, setNamahang] = useState<Video[]>([]);
  const [popular, setPopular] = useState<Video[]>([]);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [nextMajles, setNextMajles] = useState<NextMajles | null>(null);
  const [loading, setLoading] = useState(true);
  const tehranNow = useTehranNow();

  useEffect(() => {
    if (tehranNow) setNextMajles(nextWeeklyMajles(tehranNow));
  }, [tehranNow]);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const [ev, nm, pop, ph] = await Promise.all([
          supabase.from("events").select("*").order("created_at", { ascending: false }).limit(8),
          // ثابت: ۱۰ نماهنگ تازه، مرتب بر اساس تاریخ انتشار. تعداد و ترتیب را کم نکن.
          supabase.from("videos").select("*").ilike("title", "%نماهنگ%").order("created_at", { ascending: false }).limit(10),
          supabase.from("videos").select("*").in("aparat_id", popularIds),
          supabase.from("photos").select("event_id,url,caption,created_at").order("created_at", { ascending: true }),
        ]);
        const sortedEvents = [...(ev.data || [])].sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || ""));
        const sortedPopular = [...(pop.data || [])].sort((a, b) => (popularViews[b.aparat_id] || 0) - (popularViews[a.aparat_id] || 0));
        setEvents(sortedEvents);
        setCovers(coverByEvent(ph.data || []));
        setNamahang(nm.data || []);
        setPopular(sortedPopular);
      }
      setLoading(false);
    }
    load();
  }, []);

  const weeklyCount = events.filter((e) => (e.title || "").includes("روضه") || (e.title || "").includes("هفتگی")).length;

  return (
    <div>
      <ReelRail />
      <section data-motion="fade" className="relative overflow-hidden bg-black">
        <div className="islamic-pattern-dark absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="text-center md:text-right">
              <div className="mb-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <ThemeImage darkSrc="/brand/heyat-mark.png" lightSrc="/brand/heyat-mark-ink.png" alt="هیئت فدائیان حضرت زهرا" className="h-14 w-auto object-contain sm:h-[4.5rem]" />
                <ThemeImage darkSrc="/brand/taheri-mark.png" lightSrc="/brand/taheri-mark-ink.png" alt="حسین طاهری" className="h-14 w-auto object-contain sm:h-[4.5rem]" />
                <ThemeImage darkSrc="/brand/fadak-wordmark.png" lightSrc="/brand/fadak-wordmark-ink.png" alt="فدک" className="h-12 w-auto max-w-[7.5rem] object-contain sm:h-[4.5rem] sm:max-w-[12.5rem]" />
              </div>
              <span className="text-sm font-medium text-[#c9a227]">اطلاعیه</span>
              <h1 className="mt-3 text-3xl font-extrabold text-white md:text-5xl">مجلس روضه هفتگی</h1>
              <p className="mt-3 text-lg text-white/80">هر سه‌شنبه — ساعت ۱۹:۳۰</p>
              <p className="mt-2 text-sm text-white/60">حسینیه سیدالشهدا (ع)، تهران</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link href="/events" className="btn-green rounded-full px-8 py-3">جزئیات و مسیریابی</Link>
                <Link href="/archive" className="rounded-full border border-white/20 px-8 py-3 text-white hover:bg-white/10">آرشیو مراسمات</Link>
              </div>
            </div>
            <HeroSlides
              nextMajles={nextMajles}
              recent={events.slice(0, 2).map((event) => ({
                id: event.id,
                href: `/archive/${event.slug}`,
                title: ceremonyCardTitle(event.title, event.date_fa),
                date: shortPersianDate(event.date_fa),
                cover: event.poster_url || covers[event.id],
              }))}
            />
          </div>
        </div>
      </section>

      <ReelShelf />

      <section data-motion="rise" className="mx-auto max-w-7xl px-4 py-10">
        <div className="section-head flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white">آخرین مراسم‌ها</h2>
            <p className="mt-1 text-sm text-white/60">جدیدترین مراسم‌های ثبت‌شده در آرشیو فدک را مشاهده و دنبال کنید.</p>
          </div>
          <Link href="/archive" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه مراسم‌ها</Link>
        </div>

        <CarouselRow className="mt-5 gap-4">
          {loading ? (
            <SectionSkeleton kind="ceremony-row" />
          ) : events.map((e) => (
              <CeremonyCard
                key={e.id}
                href={`/archive/${e.slug}`}
                title={ceremonyCardTitle(e.title, e.date_fa)}
                dateLabel={shortPersianDate(e.date_fa)}
                coverUrl={e.poster_url || covers[e.id]}
                className="w-[210px] shrink-0 sm:w-[230px]"
              />
            ))}
        </CarouselRow>
        <p className="mt-1 text-xs text-white/40">برای مشاهده بیشتر بکشید ←</p>
      </section>

      <section data-motion="media" className="bg-[#111111] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-head flex items-start justify-between gap-3">
            <div>
              <span className="text-xs text-[#14a3a2]">ویدئو</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">جدیدترین نماهنگ‌ها</h2>
              <p className="mt-1 text-sm text-white/60">جدیدترین نماهنگ‌ها و کلیپ‌های منتشرشده از مراسمات هیئت.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه نماهنگ‌ها</Link>
          </div>

          <CarouselRow className="mt-5">
            {loading ? <SectionSkeleton kind="video-row" /> : namahang.map((v) => (
              <div
                key={v.id}
                className="group relative w-64 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] transition-all duration-500 hover:w-80 hover:border-[#0e7c7b]/50"
              >
              <Link
                href={`/videos/${v.id}`}
                className="block"
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
                  <h3 className="text-sm font-bold leading-5 transition group-hover:text-[#14a3a2]">{v.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{artistFromTitle(v.title)}</p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <EngageBar type="video" id={v.id} title={v.title} href={`/videos/${v.id}`} thumb={v.thumbnail} compact />
              </div>
              </div>
            ))}
          </CarouselRow>
          <p className="mt-1 text-xs text-white/40">برای مشاهده ویدئوهای بیشتر بکشید ←</p>
        </div>
      </section>

      <section data-motion="slide" className="mx-auto max-w-7xl px-4 py-10">
        <div className="section-head flex items-start justify-between gap-3">
          <div>
            <span className="text-xs text-[#14a3a2]">آرشیو</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white">مجموعه‌ها</h2>
            <p className="mt-1 text-sm text-white/60">دسترسی سریع به آرشیو مناسبت‌های مختلف هیئت</p>
          </div>
          <Link href="/collections" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه مجموعه‌ها</Link>
        </div>
        <CarouselRow className="mt-5 gap-4">
          {collections.map((col) => {
            const style = collectionStyle[col.slug] || collectionStyle.occasions;
            const count = col.slug === "weekly" ? weeklyCount : 0;
            return (
              <Link key={col.slug} href={`/collections/${col.slug}`} className="card-hover group relative h-44 w-56 shrink-0 overflow-hidden rounded-3xl border border-white/10">
                <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, ${style.from}, ${style.to})` }} />
                <div className="islamic-pattern-dark absolute inset-0" />
                <div className="keep-contrast relative flex h-full flex-col justify-between p-5 text-white">
                  <span className="text-3xl font-extrabold text-[#c9a227]">{style.mark}</span>
                  <div>
                    <h3 className="text-xl font-extrabold">{col.name}</h3>
                    <p className="mt-1 text-xs text-white/70">{toPersianDigits(count)} مراسم · مشاهده مجموعه</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </CarouselRow>
      </section>

      <section data-motion="media" className="bg-[#111111] py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="section-head flex items-start justify-between gap-3">
            <div>
              <span className="text-xs text-[#14a3a2]">ویدئوهای برگزیده</span>
              <h2 className="mt-1 text-2xl font-extrabold text-white">محبوب‌ترین ویدئوها</h2>
              <p className="mt-1 text-sm text-white/60">پربازدیدترین نماهنگ‌های کانال فدک در آپارات، جدا از تازه‌ها.</p>
            </div>
            <Link href="/videos" className="shrink-0 text-sm text-[#14a3a2] hover:underline">همه نماهنگ‌ها</Link>
          </div>
          <CarouselRow className="mt-5">
            {loading ? <SectionSkeleton kind="video-row" /> : popular.map((v) => (
              <div
                key={v.id}
                className="group relative w-64 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] transition-all duration-500 hover:w-80 hover:border-[#0e7c7b]/50"
              >
              <Link
                href={`/videos/${v.id}`}
                className="block"
              >
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-4xl text-white/20">🎬</div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0e7c7b] text-2xl text-white shadow-2xl">▶</span>
                  </span>
                  {v.duration && <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>}
                  <span className="absolute top-2 right-2 rounded bg-black/80 px-2 py-1 text-[10px] text-white">{formatViews(popularViews[v.aparat_id] || 0)}</span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5 transition group-hover:text-[#14a3a2]">{v.title}</h3>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <EngageBar type="video" id={v.id} title={v.title} href={`/videos/${v.id}`} thumb={v.thumbnail} compact />
              </div>
              </div>
            ))}
          </CarouselRow>
        </div>
      </section>

      <section data-motion="lift" className="mx-auto max-w-7xl px-4 py-10">
        <div className="keep-contrast rounded-3xl bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-8 text-center text-white md:p-10">
          <p className="text-sm text-[#c9a227]">یک قدم برای ساختن یک خانه ماندگار</p>
          <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">با هم، آینده حسینیه را بسازیم</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/80">
            ساخت حسینیه با همراهی دل‌های مهربان شکل می‌گیرد. چه با کمک در مسیر ساخت‌وساز و چه با اهدای نذورات، سهم شما می‌تواند بخشی از این بنای ماندگار باشد.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/donate" className="btn-gold rounded-full px-6 py-3 text-right">
              <span className="block">مشارکت در ساخت</span>
              <span className="block text-xs font-medium opacity-80">همراهی در تکمیل حسینیه</span>
            </Link>
            <Link href="/donate" className="rounded-full border border-white/30 px-6 py-3 text-right transition hover:bg-white/10">
              <span className="block font-bold">اهدای نذورات</span>
              <span className="block text-xs text-white/70">نذر و کمک‌های مردمی</span>
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4">این بنا، با همراهی شما ساخته می‌شود</div>
            <div className="rounded-2xl bg-white/10 p-4">مشارکت به اندازه توان شما</div>
            <div className="rounded-2xl bg-white/10 p-4">همراهی در یک کار ماندگار</div>
            <div className="rounded-2xl bg-white/10 p-4">هر همراهی، گامی به سوی تکمیل حسینیه</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div data-motion="rise" className="section-head flex items-end justify-between gap-3">
          <div>
            <span className="text-xs text-[#14a3a2]">اخبار و اعلامیه</span>
            <h2 className="mt-1 text-2xl font-extrabold text-white">آخرین خبرهای هیئت</h2>
          </div>
        </div>
        <div data-motion-stagger="rise" className="mt-5 grid gap-4 md:grid-cols-3">
          <a href="https://gharaar.net" target="_blank" rel="noopener noreferrer" className="card-hover rounded-3xl border border-white/10 bg-[#1a1a1a] p-6">
            <p className="text-xs text-[#c9a227]">فرهنگی</p>
            <h3 className="mt-2 text-lg font-extrabold">قرار بی‌قرارها</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">برنامه‌ها و فعالیت‌های فرهنگی هیئت فدائیان حضرت زهرا (س).</p>
          </a>
          <Link href="/khadam" className="card-hover rounded-3xl border border-white/10 bg-[#1a1a1a] p-6">
            <p className="text-xs text-[#c9a227]">اطلاعیه</p>
            <h3 className="mt-2 text-lg font-extrabold">ثبت‌نام خادمین</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">همکاری در صوت، تصویر، پذیرایی و بقیه کارها.</p>
          </Link>
          <Link href="/archive" className="card-hover rounded-3xl border border-white/10 bg-[#1a1a1a] p-6">
            <p className="text-xs text-[#c9a227]">آرشیو</p>
            <h3 className="mt-2 text-lg font-extrabold">مراسم‌های ثبت‌شده</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">صوت، عکس و ویدیوی مجالس گذشته، هر مراسم در صفحه خودش.</p>
          </Link>
        </div>
      </section>

      <section data-motion="fade" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-8">
            <span className="text-xs text-[#14a3a2]">موقعیت حسینیه</span>
            <h2 className="mt-2 text-2xl font-extrabold text-white">حسینیه سیدالشهدا (ع)</h2>
            <p className="mt-3 leading-7 text-white/70">برای حضور در مراسم‌ها و برنامه‌های حسینیه، می‌توانید موقعیت مجموعه را روی نقشه مشاهده کنید.</p>
            <div className="mt-4">
              <p className="text-sm font-bold">آدرس</p>
              <p className="mt-1 text-sm leading-6 text-white/60">{fadakAddress}</p>
            </div>
            <a href={fadakMapUrl} target="_blank" rel="noopener noreferrer" className="btn-green mt-5 inline-block rounded-full px-6 py-3">مسیریابی</a>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a]">
            <iframe
              title="نقشه حسینیه سیدالشهدا"
              src={fadakMapEmbed}
              className="h-full min-h-72 w-full border-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
