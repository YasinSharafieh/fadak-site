import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { comparePersianDates } from "@/lib/jalali";

export const instant = false;

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  let events: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    events = [...(data || [])].sort((a, b) => comparePersianDates(a.date_fa || "", b.date_fa || ""));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">مدیریت مراسم‌ها</h1>
        <Link href="/admin" className="text-sm text-[#14a3a2] hover:underline">← بازگشت به داشبورد</Link>
      </div>

      {/* فرم افزودن مراسم */}
      <form action="/api/admin/events" method="POST" className="gold-frame mt-8 rounded-3xl bg-[#1a1a1a] p-6 space-y-4">
        <h2 className="text-lg font-extrabold">افزودن مراسم جدید</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold">عنوان مراسم *</label>
            <input name="title" required className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="مجلس روضه هفتگی" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">تاریخ شمسی *</label>
            <input name="date_fa" required className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="سه‌شنبه ۲۱ آبان ۱۴۰۵" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold">سخنران</label>
            <input name="speaker" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="حجت‌الاسلام..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">مداحان</label>
            <input name="maddah" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="کربلایی حسین طاهری" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">وضعیت</label>
          <select name="status" className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3">
            <option value="upcoming">آینده</option>
            <option value="past">گذشته</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">توضیحات</label>
          <textarea name="description" rows={3} className="w-full rounded-xl border border-[#0e7c7b]/40 px-4 py-3" placeholder="توضیحات مراسم..." />
        </div>
        <button className="btn-green w-full rounded-xl py-3">افزودن مراسم</button>
      </form>

      {/* لیست مراسم‌ها */}
      <div className="mt-8 space-y-3">
        <h2 className="text-lg font-extrabold">مراسم‌های موجود ({events.length})</h2>
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-2xl bg-[#1a1a1a] p-4 shadow">
            <div>
              <div className="font-bold">{e.title}</div>
              <div className="text-sm text-white/70/70">{e.date_fa} • {e.status === "upcoming" ? "آینده" : "گذشته"}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/archive/${e.slug}`} className="rounded-full border px-4 py-2 text-sm hover:bg-[#111111] transition">مشاهده</Link>
              <Link href="/admin/upload" className="rounded-full bg-[#0b3d2e] px-4 py-2 text-sm text-white">آپلود صوت</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
