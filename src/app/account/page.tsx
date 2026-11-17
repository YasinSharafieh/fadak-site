"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rememberEngage } from "@/components/EngageBar";
import { displayIranMobile } from "@/lib/phone";

type User = {
  id: string;
  phone: string;
  name: string;
  family: string;
  city: string;
  username: string;
  role: "user" | "admin";
};
type Saved = { key: string; title: string; href: string; thumb?: string };

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Saved[]>([]);
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [city, setCity] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/auth/me", { cache: "no-store" });
      const who = await me.json();
      if (!who.user) {
        window.location.href = "/login?next=/account";
        return;
      }
      applyUser(who.user);
      const res = await fetch("/api/account/favorites", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.id) applyUser(data.user);
        setItems(data.items || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  function applyUser(next: User) {
    setUser(next);
    setName(next.name || "");
    setFamily(next.family || "");
    setCity(next.city || "");
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    const res = await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, family, city }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok || !data.user?.name || !data.user?.family || !data.user?.city) {
      setNotice(data.error || "ذخیره انجام نشد.");
      return;
    }
    applyUser(data.user);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  async function removeItem(key: string) {
    const previous = items;
    setItems((list) => list.filter((item) => item.key !== key));
    const res = await fetch(`/api/account/favorites?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    if (!res.ok) {
      setItems(previous);
      return;
    }
    const data = await res.json();
    if (Array.isArray(data.items)) setItems(data.items);
    const [type, id] = key.split(":");
    if (type && id) rememberEngage(type, id, { saved: false });
  }

  if (loading) return <p className="px-4 py-20 text-center text-white/60">در حال بارگذاری حساب...</p>;
  if (!user) return null;

  const fullName = [user.name, user.family].filter(Boolean).join(" ");
  const profileReady = Boolean(user.name && user.family && user.city);
  const videos = items.filter((item) => item.key.startsWith("video:") || item.key.startsWith("reel:"));
  const audios = items.filter((item) => item.key.startsWith("audio:"));
  const rest = items.filter((item) => !videos.includes(item) && !audios.includes(item));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#c9a227]">حساب کاربری</p>
          <h1 className="mt-1 text-3xl font-extrabold">{fullName || user.username || "کاربر فدک"}</h1>
          {fullName && user.username && <p className="mt-1 text-sm text-white/60">{user.username}</p>}
          {user.phone && <p className="mt-1 text-sm text-white/60" dir="ltr">{displayIranMobile(user.phone)}</p>}
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && <Link href="/admin" className="rounded-full border border-[#c9a227]/50 px-4 py-2 text-sm text-[#c9a227]">مدیریت</Link>}
          <button onClick={logout} className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-red-400 hover:text-red-300">خروج</button>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-[#c9a227]/30 bg-[#111] p-6">
        <h2 className="text-lg font-extrabold">اطلاعات من</h2>
        {profileReady ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Info label="نام" value={user.name} />
            <Info label="نام خانوادگی" value={user.family} />
            <Info label="شهر" value={user.city} />
            <Info label="نام کاربری" value={user.username} />
          </dl>
        ) : (
          <form onSubmit={saveProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              نام
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5" required />
            </label>
            <label className="block text-sm">
              نام خانوادگی
              <input value={family} onChange={(e) => setFamily(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5" required />
            </label>
            <label className="block text-sm sm:col-span-2">
              شهر
              <input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5" required />
            </label>
            <div className="sm:col-span-2">
              <button disabled={saving} className="btn-green rounded-full px-6 py-2.5 text-sm">{saving ? "در حال ذخیره..." : "ذخیره اطلاعات"}</button>
              {notice && <p className="mt-3 text-sm text-red-300">{notice}</p>}
            </div>
          </form>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-extrabold">علاقه‌مندی‌ها</h2>
        <p className="mt-1 text-sm text-white/55">ویدیوها و صوت‌هایی که ذخیره کرده‌اید.</p>
        {items.length === 0 && <p className="mt-4 rounded-2xl bg-[#1a1a1a] p-5 text-sm text-white/60">هنوز چیزی ذخیره نکرده‌اید.</p>}
        {videos.length > 0 && <SavedList title="ویدیوها" items={videos} onRemove={removeItem} />}
        {audios.length > 0 && <SavedList title="صوت‌ها" items={audios} onRemove={removeItem} />}
        {rest.length > 0 && <SavedList title="سایر" items={rest} onRemove={removeItem} />}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <dt className="text-xs text-[#c9a227]">{label}</dt>
      <dd className="mt-1 font-bold">{value || "ثبت نشده"}</dd>
    </div>
  );
}

function SavedList({ title, items, onRemove }: { title: string; items: Saved[]; onRemove: (key: string) => void }) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold text-[#14a3a2]">{title}</h3>
      <div className="mt-2 space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1a1a] p-3">
            <Link href={item.href || "/"} className="flex min-w-0 flex-1 items-center gap-3 hover:text-[#e8c766]">
              {item.thumb ? <img src={item.thumb} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0b3d2e]">♪</span>}
              <span className="min-w-0 flex-1 truncate font-bold">{item.title}</span>
            </Link>
            <button
              type="button"
              onClick={() => onRemove(item.key)}
              className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:border-red-400 hover:text-red-300"
            >
              حذف از علاقه‌مندی
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
