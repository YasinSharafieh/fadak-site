"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { displayIranMobile } from "@/lib/phone";

type User = { id: string; phone: string; name: string; city: string; username: string; role: "user" | "admin" };
type Saved = { key: string; title: string; href: string; thumb?: string };

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Saved[]>([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/account/favorites");
      if (res.status === 401) {
        window.location.href = "/login?next=/account";
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setName(data.user?.name || "");
      setCity(data.user?.city || "");
      setItems(data.items || []);
      setLoading(false);
    }
    load();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, city }),
    });
    const data = await res.json();
    if (data.user) setUser(data.user);
    setMessage("اطلاعات ذخیره شد.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (loading) return <p className="px-4 py-20 text-center text-white/60">در حال بارگذاری حساب...</p>;
  if (!user) return null;

  const videos = items.filter((item) => item.key.startsWith("video:") || item.key.startsWith("reel:"));
  const audios = items.filter((item) => item.key.startsWith("audio:"));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#c9a227]">حساب کاربری</p>
          <h1 className="mt-1 text-3xl font-extrabold">{user.name || user.username || "کاربر فدک"}</h1>
          {user.username && <p className="mt-1 text-sm text-white/60">{user.username}</p>}
          {user.phone && <p className="mt-1 text-sm text-white/60" dir="ltr">{displayIranMobile(user.phone)}</p>}
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && <Link href="/admin" className="rounded-full border border-[#c9a227]/50 px-4 py-2 text-sm text-[#c9a227]">مدیریت</Link>}
          <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-red-400 hover:text-red-300">خروج</button>
        </div>
      </div>

      <form onSubmit={saveProfile} className="mt-8 rounded-3xl border border-[#c9a227]/30 bg-[#111] p-6">
        <h2 className="text-lg font-extrabold">اطلاعات من</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            نام و نام خانوادگی
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5" />
          </label>
          <label className="block text-sm">
            شهر
            <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5" />
          </label>
        </div>
        <button className="btn-green mt-4 rounded-full px-6 py-2.5 text-sm">ذخیره اطلاعات</button>
        {message && <p className="mt-3 text-sm text-[#14a3a2]">{message}</p>}
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold">علاقه‌مندی‌ها</h2>
        <p className="mt-1 text-sm text-white/55">ویدیوها و صوت‌هایی که ذخیره کرده‌اید.</p>
        {items.length === 0 && <p className="mt-4 rounded-2xl bg-[#1a1a1a] p-5 text-sm text-white/60">هنوز چیزی ذخیره نکرده‌اید.</p>}
        {videos.length > 0 && <SavedList title="ویدیوها" items={videos} />}
        {audios.length > 0 && <SavedList title="صوت‌ها" items={audios} />}
      </section>
    </div>
  );
}

function SavedList({ title, items }: { title: string; items: Saved[] }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-[#14a3a2]">{title}</h3>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <Link key={item.key} href={item.href || "/"} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-3 hover:border-[#0e7c7b]">
            {item.thumb ? <img src={item.thumb} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0b3d2e]">♪</span>}
            <span className="min-w-0 flex-1 truncate font-bold">{item.title}</span>
            <span className="text-[#c9a227]">←</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
