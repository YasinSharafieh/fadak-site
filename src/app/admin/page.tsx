import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const instant = false;

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  let stats = { events: 0, audios: 0, photos: 0, videos: 0, poems: 0, khadam: 0 };
  if (supabase) {
    const [ev, au, ph, vi, po, kh] = await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("audios").select("id", { count: "exact", head: true }),
      supabase.from("photos").select("id", { count: "exact", head: true }),
      supabase.from("videos").select("id", { count: "exact", head: true }),
      supabase.from("poems").select("id", { count: "exact", head: true }),
      supabase.from("khadam_requests").select("id", { count: "exact", head: true }),
    ]);
    stats = {
      events: ev.count || 0,
      audios: au.count || 0,
      photos: ph.count || 0,
      videos: vi.count || 0,
      poems: po.count || 0,
      khadam: kh.count || 0,
    };
  }

  const cards = [
    { label: "مراسم‌ها", value: stats.events, icon: "🕌", href: "/admin/events" },
    { label: "صوت‌ها", value: stats.audios, icon: "🎵", href: "/admin/upload" },
    { label: "عکس‌ها", value: stats.photos, icon: "📷", href: "/archive" },
    { label: "ویدیوها", value: stats.videos, icon: "🎬", href: "/videos" },
    { label: "اشعار", value: stats.poems, icon: "📜", href: "/poems" },
    { label: "درخواست خادم", value: stats.khadam, icon: "🤝", href: "/admin/khadam" },
    { label: "کاربران", value: "حساب‌ها", icon: "👤", href: "/admin/users" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">داشبورد مدیریت</h1>
        <div className="flex gap-2">
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-white/20 px-4 py-3 text-sm">خروج</button>
          </form>
          <Link href="/admin/upload" className="btn-gold rounded-full px-6 py-3">
            + آپلود صوت
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="card-hover gold-frame rounded-2xl bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{card.icon}</span>
              <span className="text-3xl font-extrabold text-white">{card.value}</span>
            </div>
            <p className="mt-3 font-bold">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link href="/admin/events" className="card-hover rounded-2xl bg-[#0b3d2e] p-6 text-white">
          <div className="text-2xl">🕌</div>
          <div className="mt-2 text-lg font-extrabold">مدیریت مراسم‌ها</div>
          <p className="mt-1 text-sm text-white/70">افزودن و ویرایش مراسم‌ها</p>
        </Link>
        <Link href="/admin/upload" className="card-hover rounded-2xl bg-[#0e7c7b] p-6 text-white">
          <div className="text-2xl">🎵</div>
          <div className="mt-2 text-lg font-extrabold">آپلود صوت</div>
          <p className="mt-1 text-sm text-white/70">آپلود مستقیم فایل صوتی</p>
        </Link>
      </div>
    </div>
  );
}
