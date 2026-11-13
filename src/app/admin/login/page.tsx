"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", { method: "POST", body: form });
    if (res.ok) {
      window.location.href = "/admin/upload";
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="gold-frame rounded-3xl bg-white p-8">
        <h1 className="text-center text-2xl font-extrabold text-[#0B3D2E]">ورود به پنل مدیریت</h1>
        <p className="mt-2 text-center text-sm text-[#3D2B1F]/70">هیأت فدائیان حضرت زهرا (س)</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">نام کاربری</label>
            <input name="username" required className="w-full rounded-xl border border-[#C9A227]/40 px-4 py-3" placeholder="نام کاربری" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">رمز عبور</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-[#C9A227]/40 px-4 py-3" placeholder="رمز عبور" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-[#0B3D2E] py-3 font-bold text-[#F7F3E8] disabled:opacity-50">
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}
