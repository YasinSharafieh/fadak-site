export const instant = false;

import { supabase } from "@/lib/supabase";

export default async function AdminKhadamPage() {
  let requests: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("khadam_requests").select("*").order("created_at", { ascending: false }).limit(20);
    requests = data || [];
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">درخواست‌های خادمین</h1>
      <p className="mt-2 text-[#3D2B1F]/80">درخواست‌های ثبت‌نام خادمین — تایید یا رد کنید</p>
      <div className="mt-8 space-y-4">
        {requests.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center text-[#3D2B1F]/70 shadow">
            هنوز درخواستی ثبت نشده. وقتی کسی از فرم /khadam ثبت‌نام کنه، اینجا دیده می‌شه.
          </div>
        )}
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center justify-between">
              <div className="font-bold">{r.full_name}</div>
              <span className="rounded-full bg-[#F7F3E8] px-3 py-1 text-xs">{r.status}</span>
            </div>
            <div className="mt-1 text-sm text-[#3D2B1F]/70">{r.mobile} | {r.city} | {r.service_type}</div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-full bg-[#0B3D2E] px-4 py-2 text-sm text-white">تایید</button>
              <button className="rounded-full border px-4 py-2 text-sm">رد</button>
            </div>
          </div>
        ))}
      </div>
      <a href="/admin" className="mt-6 inline-block text-sm text-[#0E7C7B]">← بازگشت به پنل</a>
    </div>
  );
}
