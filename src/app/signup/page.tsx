"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeImage from "@/components/ThemeImage";

function safeNext() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "";
}

export default function SignupPage() {
  const [step, setStep] = useState<"phone" | "code" | "account">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState("");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
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
      setError(data.error || "کد تایید اشتباه است.");
      return;
    }
    setTicket(data.ticket || "");
    setStep("account");
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    if (password !== again) {
      setError("رمز عبور یکسان نیست.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket, name, family, username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      setError(data.error || "ثبت نام انجام نشد.");
      return;
    }
    window.location.href = safeNext() || "/account";
  }

  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <div className="w-full rounded-3xl border border-[#c9a227]/40 bg-[#1a1a1a] p-7 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <ThemeImage darkSrc="/brand/fadak-mark.png" lightSrc="/brand/fadak-mark.png" alt="" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-xs text-[#c9a227]">هیأت فدائیان حضرت زهرا (س)</p>
              <h1 className="text-2xl font-extrabold text-white">ثبت نام</h1>
            </div>
          </div>

          {step === "phone" && (
            <form onSubmit={sendCode} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-white" htmlFor="phone">شماره موبایل</label>
              <input
                id="phone"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-center text-lg tracking-wider text-white"
                required
              />
              {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="btn-green w-full rounded-full py-3">{loading ? "در حال ارسال..." : "دریافت کد تایید"}</button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verify} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-white" htmlFor="code">کد تایید</label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-2xl border border-[#c9a227]/40 bg-black/40 px-4 py-3 text-center text-2xl tracking-[0.4em] text-white"
                required
              />
              {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="btn-gold w-full rounded-full py-3">{loading ? "در حال بررسی..." : "تایید"}</button>
              <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="w-full text-sm text-[#14a3a2]">ویرایش شماره</button>
            </form>
          )}

          {step === "account" && (
            <form onSubmit={register} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-white" htmlFor="name">نام</label>
              <input
                id="name"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
                required
              />
              <label className="block text-sm font-bold text-white" htmlFor="family">نام خانوادگی</label>
              <input
                id="family"
                autoComplete="family-name"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
                required
              />
              <label className="block text-sm font-bold text-white" htmlFor="username">نام کاربری</label>
              <input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
                required
              />
              <p className="text-xs text-white/50">برای ورودهای بعدی است و بالای سایت با همین نام دیده می‌شود. نام کاربری تکراری پذیرفته نمی‌شود.</p>
              <label className="block text-sm font-bold text-white" htmlFor="password">رمز عبور</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
                required
              />
              <label className="block text-sm font-bold text-white" htmlFor="again">تکرار رمز عبور</label>
              <input
                id="again"
                type="password"
                autoComplete="new-password"
                value={again}
                onChange={(e) => setAgain(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
                required
              />
              {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
              <button disabled={loading} className="btn-green w-full rounded-full py-3">{loading ? "در حال ساخت..." : "ثبت نام"}</button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-white/70">
            <Link href="/login" className="font-bold text-[#c9a227] hover:underline">ورود</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
