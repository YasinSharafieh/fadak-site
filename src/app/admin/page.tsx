import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">پنل مدیریت فدک</h1>
      <p className="mt-2 text-[#3D2B1F]/80">مدیریت مراسم، صوت، عکس، شعر، ریلز و درخواست‌های خادمین</p>
      <div className={`mt-6 rounded-2xl p-4 ${isSupabaseConfigured ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
        {isSupabaseConfigured ? "✅ Supabase وصل است — می‌توانید محتوا اضافه کنید." : "⚠️ Supabase هنوز وصل نشده. برای فعال‌سازی، پروژه Supabase بسازید و کلیدها را در Vercel (Environment Variables) وارد کنید. راهنما: docs/setup-guide.md"}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "مراسم جدید", desc: "افزودن مراسم آینده/قبلی" },
          { title: "آپلود صوت", desc: "صوت مراسم با پلی‌لیست" },
          { title: "گالری عکس", desc: "عکس‌های مراسم" },
          { title: "خادمین", desc: "بررسی درخواست‌ها" },
        ].map((c) => (
          <div key={c.title} className="gold-frame rounded-2xl bg-white p-5">
            <div className="font-extrabold">{c.title}</div>
            <div className="mt-1 text-sm text-[#3D2B1F]/70">{c.desc}</div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[#3D2B1F]/60">فرم‌های کامل افزودن محتوا در فاز دیتابیس فعال می‌شوند. فعلاً ساختار آماده است.</p>
    </div>
  );
}
