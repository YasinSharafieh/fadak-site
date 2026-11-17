"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Poem = {
  id: string;
  title: string;
  poet?: string;
  text: string;
  event_id?: string;
  created_at: string;
};

export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (supabase) {
        const { data } = await supabase.from("poems").select("*").order("created_at", { ascending: false });
        setPoems(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = poems.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q) ||
      (p.poet && p.poet.toLowerCase().includes(q))
    );
  });

  if (selectedPoem) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
        <button onClick={() => setSelectedPoem(null)} className="text-sm text-[#14a3a2] hover:underline">
          ← بازگشت به اشعار
        </button>

        <div className="paper-texture gold-frame mt-6 rounded-3xl bg-[#1a1a1a] p-8 md:p-12">
          <h1 className="text-center text-2xl font-extrabold text-white">{selectedPoem.title}</h1>
          {selectedPoem.poet && (
            <p className="mt-2 text-center text-sm text-white/70/70">شاعر: {selectedPoem.poet}</p>
          )}

          <div className="poem-text mt-8 whitespace-pre-line text-center text-lg leading-loose text-[#1a2e28]">
            {selectedPoem.text}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedPoem.text);
                alert("متن شعر کپی شد!");
              }}
              className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition"
            >
              📋 کپی متن
            </button>
            <button className="rounded-full border px-5 py-2 text-sm hover:bg-[#111111] transition">
              📤 اشتراک‌گذاری
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">اشعار و متون</h1>
        <p className="mt-2 text-white/70/70">آرشیو اشعار با جستجوی متن کامل</p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <input
          type="text"
          placeholder="جستجو در اشعار... (یک بیت هم می‌تونی بنویسی)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-[#0e7c7b]/40 bg-[#1a1a1a] px-6 py-4"
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-center text-white/70/60">در حال بارگذاری...</p>
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-white/70/60">شعری یافت نشد.</p>
        ) : (
          filtered.map((poem) => (
            <button
              key={poem.id}
              onClick={() => setSelectedPoem(poem)}
              className="card-hover paper-texture gold-frame rounded-2xl bg-[#1a1a1a] p-6 text-right"
            >
              <h3 className="font-extrabold text-white">{poem.title}</h3>
              {poem.poet && <p className="mt-1 text-sm text-white/70/70">شاعر: {poem.poet}</p>}
              <p className="poem-text mt-3 line-clamp-3 text-sm leading-7 text-white/70/80">
                {poem.text}
              </p>
              <span className="mt-3 inline-block text-sm font-bold text-[#14a3a2]">خواندن شعر ←</span>
            </button>
          ))
        )}
      </div>

      <p className="mt-8 text-center text-sm text-white/70/60">
        {filtered.length} شعر از {poems.length} شعر
      </p>
    </div>
  );
}
