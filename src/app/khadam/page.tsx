"use client";

import { useState } from "react";

const skills = [
  "صوت و صدابرداری",
  "تصویر و فیلمبرداری",
  "تدوین",
  "عکاسی",
  "شعر و ادبیات",
  "ترجمه",
  "پشتیبانی",
  "رسانه و شبکه‌های اجتماعی",
  "فنی و IT",
  "تدارکات",
  "طراحی گرافیک",
  "مدیریت مراسم",
];

export default function KhadamPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    form.set("skills", selectedSkills.join(", "));

    const res = await fetch("/api/khadam", { method: "POST", body: form });
    if (res.ok) {
      setSubmitted(true);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-in">
        <div className="text-6xl">✅</div>
        <h1 className="mt-4 text-2xl font-extrabold text-white">درخواست شما ثبت شد!</h1>
        <p className="mt-3 text-white/70/70">از اینکه می‌خواهید خادم هیئت باشید سپاسگزاریم. به‌زودی با شما تماس می‌گیریم.</p>
        <a href="/" className="btn-green mt-6 inline-block rounded-full px-6 py-3">بازگشت به خانه</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">ثبت‌نام خادمین فدک</h1>
        <p className="mt-2 text-white/70/70">برای خدمت در هیئت ثبت‌نام کنید — هر مهارتی ارزشمند است</p>
      </div>

      <form data-motion="rise" onSubmit={handleSubmit} className="gold-frame mt-8 rounded-3xl bg-[#1a1a1a] p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold">نام و نام خانوادگی *</label>
            <input name="name" required className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="نام کامل" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">شماره موبایل *</label>
            <input name="phone" required type="tel" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="0912..." />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">ایمیل</label>
          <input name="email" type="email" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="example@email.com" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">مهارت‌ها *</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  selectedSkills.includes(skill)
                    ? "bg-[#0b3d2e] text-white"
                    : "border hover:bg-[#111111]"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          {selectedSkills.length === 0 && <p className="mt-2 text-xs text-red-500">حداقل یک مهارت انتخاب کنید</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">سابقه و نمونه‌کار</label>
          <textarea name="portfolio" rows={3} className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="توضیح مختصر درباره سابقه یا لینک نمونه‌کار..." />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">میزان availability</label>
          <select name="availability" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3">
            <option>همیشه در دسترس</option>
            <option>فقط مراسم‌های خاص</option>
            <option>پاره‌وقت</option>
            <option>دورکاری</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">توضیحات اضافی</label>
          <textarea name="message" rows={3} className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="هر چیزی که دوست دارید بگید..." />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1" />
          <span>با حفظ حریم خصوصی و شرایط استفاده موافقم</span>
        </label>

        <button
          type="submit"
          disabled={loading || selectedSkills.length === 0}
          className="btn-green w-full rounded-xl py-4 text-lg disabled:opacity-50"
        >
          {loading ? "در حال ارسال..." : "ثبت درخواست"}
        </button>
      </form>
    </div>
  );
}
