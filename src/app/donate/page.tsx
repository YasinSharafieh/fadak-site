"use client";

import { useState } from "react";

const amounts = [50000, 100000, 200000, 500000, 1000000];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = selectedAmount || parseInt(customAmount) || 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (finalAmount <= 0) return;

    // در نسخه اول: ثبت درخواست کمک (درگاه پرداخت بعداً اضافه می‌شه)
    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalAmount, name: donorName }),
    });

    if (res.ok) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-in">
        <div className="text-6xl">❤️</div>
        <h1 className="mt-4 text-2xl font-extrabold text-white">از حمایت شما سپاسگزاریم!</h1>
        <p className="mt-3 text-white/70/70">درخواست کمک شما ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>
        <a href="/" className="btn-green mt-6 inline-block rounded-full px-6 py-3">بازگشت به خانه</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">کمک به هیئت</h1>
        <p className="mt-2 text-white/70/70">حمایت مالی از مراسم‌ها و فعالیت‌های هیئت فدائیان حضرت زهرا (س)</p>
      </div>

      {/* شفافیت */}
      <div data-motion="lift" className="gold-frame mt-8 rounded-3xl bg-[#1a1a1a] p-8">
        <h2 className="text-lg font-extrabold text-white">کمک شما کجا مصرف می‌شه؟</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/70/80">
          <li>• برگزاری مراسم‌های روضه هفتگی و مناسبت‌های مذهبی</li>
          <li>• تهیه و نگهداری تجهیزات صوتی و تصویری</li>
          <li>• تولید نماهنگ‌ها و محتوای رسانه‌ای</li>
          <li>• نگهداری و توسعه حسینیه سیدالشهدا (ع)</li>
          <li>• حمایت از برنامه‌های فرهنگی و آموزشی</li>
        </ul>
        <p className="mt-4 rounded-xl bg-[#111111] p-4 text-sm">
          <span className="font-bold">شفافیت:</span> گزارش هزینه‌ها و کمک‌ها به‌صورت دوره‌ای منتشر می‌شه. حریم خصوصی کمک‌کنندگان محفوظ است.
        </p>
      </div>

      <form data-motion="lift" onSubmit={handleSubmit} className="gold-frame mt-6 rounded-3xl bg-[#1a1a1a] p-8 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold">مبلغ کمک (تومان)</label>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                className={`rounded-full px-5 py-2 transition ${
                  selectedAmount === amt
                    ? "bg-[#0b3d2e] text-white"
                    : "border hover:bg-[#111111]"
                }`}
              >
                {amt.toLocaleString("fa-IR")} تومان
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="مبلغ دلخواه (تومان)"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
            className="mt-3 w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold">نام (اختیاری)</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3"
            placeholder="نام شما"
          />
        </div>

        <div className="rounded-xl bg-[#111111] p-4 text-sm">
          <p><span className="font-bold">مبلغ نهایی:</span> {finalAmount > 0 ? `${finalAmount.toLocaleString("fa-IR")} تومان` : "—"}</p>
          <p className="mt-1 text-white/70/70">درگاه پرداخت آنلاین به‌زودی فعال می‌شه. فعلاً درخواست شما ثبت می‌شه.</p>
        </div>

        <button
          type="submit"
          disabled={finalAmount <= 0}
          className="btn-gold w-full rounded-xl py-4 text-lg disabled:opacity-50"
        >
          ثبت درخواست کمک
        </button>
      </form>

      {/* شماره کارت */}
      <div className="mt-6 rounded-2xl bg-[#0b3d2e] p-6 text-center text-white">
        <p className="font-bold">کمک مستقیم با کارت</p>
        <p className="mt-2 text-sm text-white/80">برای اطلاعات بیشتر با ادمین تلگرام در تماس باشید</p>
        <a href="https://t.me/fadak_media_bot" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-[#0e7c7b] px-5 py-2 text-sm font-bold text-white">
          تماس در تلگرام
        </a>
      </div>
    </div>
  );
}
