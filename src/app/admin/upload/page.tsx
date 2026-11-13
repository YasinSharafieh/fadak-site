import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const instant = false;

export default async function AdminUploadPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  let events: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("events").select("id,title,date_fa").order("created_at", { ascending: false });
    events = data || [];
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-extrabold text-[#0B3D2E]">آپلود صوت مراسم</h1>
      <p className="mt-2 text-sm text-[#3D2B1F]/70">صوت رو انتخاب کن، مراسم رو مشخص کن و عنوانش رو بنویس.</p>

      <form action="/api/admin/upload-audio" method="POST" encType="multipart/form-data" className="gold-frame mt-6 rounded-3xl bg-white p-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold">مراسم</label>
          <select name="event_id" required className="w-full rounded-xl border border-[#C9A227]/40 px-4 py-3">
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title} — {e.date_fa}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">عنوان صوت</label>
          <input name="title" required className="w-full rounded-xl border border-[#C9A227]/40 px-4 py-3" placeholder="مثلاً: شور | یوحنا" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold">فایل صوتی</label>
          <input name="file" type="file" accept="audio/*" required className="w-full rounded-xl border border-[#C9A227]/40 px-4 py-3" />
        </div>
        <button className="w-full rounded-xl bg-[#0B3D2E] py-3 font-bold text-[#F7F3E8]">آپلود صوت</button>
      </form>

      <div className="mt-8 flex gap-4">
        <a href="/admin" className="text-sm text-[#0E7C7B]">← بازگشت به پنل</a>
        <a href="/archive" className="text-sm text-[#0E7C7B]">مشاهده آرشیو</a>
      </div>
    </div>
  );
}
