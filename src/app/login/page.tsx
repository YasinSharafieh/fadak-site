"use client";

import { useState } from "react";
import ThemeImage from "@/components/ThemeImage";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      setError(data.error || "ارسال کد انجام نشد.");
      return;
    }
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      setError(data.error || "ورود انجام نشد.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
    window.location.href = data.needsName ? `/account?welcome=1&next=${encodeURIComponent(safe)}` : safe;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <div className="w-full rounded-3xl border border-[#c9a227]/40 bg-[#0c1211]/95 p-7 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <ThemeImage darkSrc="/brand/fadak-mark.png" lightSrc="/brand/fadak-mark.png" alt="" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-xs text-[#c9a227]">هیأت فدائیان حضرت زهرا (س)</p>
              <h1 className="text-2xl font-extrabold text-white">ورود به فدک</h1>
            </div>
          </div>
          <p className="mt-4 text-center text-sm leading-6 text-white/65">
            برای لایک و ذخیره در علاقه‌مندی‌ها، با شماره موبایل وارد شوید. بدون حساب این کارها انجام نمی‌شود.
          </p>
          <div className="mt-5 flex justify-center gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 ${step === "phone" ? "bg-[#0e7c7b] text-white" : "bg-white/10 text-white/60"}`}>۱. شماره</span>
            <span className={`rounded-full px-3 py-1 ${step === "code" ? "bg-[#0e7c7b] text-white" : "bg-white/10 text-white/60"}`}>۲. کد تایید</span>
          </div>

          {step === "phone" ? (
            <form onSubmit={sendCode} className="mt-6 space-y-4">
              <label className="block text-sm font-bold" htmlFor="phone">شماره موبایل</label>
              <input
                id="phone"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-center text-lg tracking-wider"
                required
              />
              {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="btn-green w-full rounded-full py-3">{loading ? "در حال ارسال..." : "دریافت کد تایید"}</button>
            </form>
          ) : (
            <form onSubmit={verify} className="mt-6 space-y-4">
              <p className="text-center text-sm text-white/70">کد پنج‌رقمی پیامک‌شده را وارد کنید.</p>
              <input
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="•••••"
                className="w-full rounded-2xl border border-[#c9a227]/40 bg-black/40 px-4 py-3 text-center text-2xl tracking-[0.4em]"
                required
              />
              {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="btn-gold w-full rounded-full py-3">{loading ? "در حال بررسی..." : "ورود به حساب"}</button>
              <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="w-full text-sm text-[#14a3a2]">ویرایش شماره</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
