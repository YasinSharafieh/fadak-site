export const instant = false;

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">پنل مدیریت فدک</h1>
      <p className="mt-2 text-[#3D2B1F]/80">مدیریت مراسم، صوت، عکس، شعر، ریلز و درخواست‌های خادمین</p>
      <div className={`mt-6 rounded-2xl p-4 ${isSupabaseConfigured ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
        {isSupabaseConfigured ? "✅ Supabase وصل است — می‌توانید محتوا اضافه کنید." : "⚠️ Supabase هنوز وصل نشده."}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/events" className="gold-frame rounded-2xl bg-white p-5 hover:bg-[#F7F3E8]">
          <div className="font-extrabold">مراسم جدید</div>
          <div className="mt-1 text-sm text-[#3D2B1F]/70">افزودن مراسم آینده/قبلی</div>
        </Link>
        <Link href="/admin/khadam" className="gold-frame rounded-2xl bg-white p-5 hover:bg-[#F7F3E8]">
          <div className="font-extrabold">خادمین</div>
          <div className="mt-1 text-sm text-[#3D2B1F]/70">بررسی درخواست‌ها</div>
        </Link>
        <div className="gold-frame rounded-2xl bg-white p-5">
          <div className="font-extrabold">آپلود صوت</div>
          <div className="mt-1 text-sm text-[#3D2B1F]/70">به‌زودی در فاز رسانه</div>
        </div>
        <div className="gold-frame rounded-2xl bg-white p-5">
          <div className="font-extrabold">گالری عکس</div>
          <div className="mt-1 text-sm text-[#3D2B1F]/70">به‌زودی در فاز رسانه</div>
        </div>
      </div>
    </div>
  );
}
