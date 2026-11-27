"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeImage from "@/components/ThemeImage";

function safeNext() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "";
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupHref, setSignupHref] = useState("/signup");

  useEffect(() => {
    const next = safeNext();
    if (next) setSignupHref(`/signup?next=${encodeURIComponent(next)}`);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      setError(data.error || "ورود انجام نشد.");
      return;
    }
    const next = safeNext();
    if (data.role === "admin" && !next) {
      window.location.href = "/admin";
      return;
    }
    window.location.href = next || "/account";
  }

  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark absolute inset-0 opacity-70" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <div data-motion="lift" className="w-full rounded-3xl border border-[#c9a227]/40 bg-[#1a1a1a] p-7 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <ThemeImage darkSrc="/brand/fadak-mark.png" lightSrc="/brand/fadak-mark.png" alt="" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-xs text-[#c9a227]">هیأت فدائیان حضرت زهرا (س)</p>
              <h1 className="text-2xl font-extrabold text-white">ورود</h1>
            </div>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-bold text-white" htmlFor="username">نام کاربری</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
              required
            />
            <label className="block text-sm font-bold text-white" htmlFor="password">رمز عبور</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white"
              required
            />
            {error && <p className="rounded-xl bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="btn-green w-full rounded-full py-3">{loading ? "در حال ورود..." : "ورود"}</button>
          </form>
          <p className="mt-5 text-center text-sm text-white/70">
            اکانت ندارید؟{" "}
            <Link href={signupHref} className="font-bold text-[#c9a227] hover:underline">ثبت نام کنید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
