import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const instant = false;

export default async function AdminKhadamPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  let requests: any[] = [];
  if (supabase) {
    const { data } = await supabase.from("khadam_requests").select("*").order("created_at", { ascending: false });
    requests = data || [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[#0B3D2E]">درخواست‌های خادم</h1>
        <Link href="/admin" className="text-sm text-[#0E7C7B] hover:underline">← بازگشت به داشبورد</Link>
      </div>

      <div className="mt-8 space-y-4">
        {requests.length === 0 ? (
          <div className="gold-frame rounded-2xl bg-white p-8 text-center">
            <div className="text-4xl">🤝</div>
            <p className="mt-3 font-bold">درخواستی ثبت نشده</p>
            <p className="mt-1 text-sm text-[#3D2B1F]/70">وقتی کسی برای خادم شدن ثبت‌نام کند، اینجا نمایش داده می‌شود.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="gold-frame rounded-2xl bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold">{req.name}</h3>
                  <p className="mt-1 text-sm text-[#3D2B1F]/70">📱 {req.phone} {req.email && `• 📧 ${req.email}`}</p>
                </div>
                <span className="rounded-full bg-[#F7F3E8] px-3 py-1 text-xs">{new Date(req.created_at).toLocaleDateString("fa-IR")}</span>
              </div>

              {req.skills && (
                <div className="mt-3">
                  <span className="text-sm font-bold">مهارت‌ها:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {req.skills.split(", ").map((s: string) => (
                      <span key={s} className="rounded-full bg-[#0B3D2E] px-3 py-1 text-xs text-white">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {req.portfolio && (
                <p className="mt-3 text-sm"><span className="font-bold">سابقه:</span> {req.portfolio}</p>
              )}

              {req.availability && (
                <p className="mt-1 text-sm"><span className="font-bold">دسترس‌پذیری:</span> {req.availability}</p>
              )}

              {req.message && (
                <p className="mt-3 rounded-xl bg-[#F7F3E8] p-3 text-sm">{req.message}</p>
              )}

              <div className="mt-4 flex gap-2">
                <a href={`tel:${req.phone}`} className="rounded-full bg-[#0B3D2E] px-4 py-2 text-sm text-white">📞 تماس</a>
                {req.email && <a href={`mailto:${req.email}`} className="rounded-full border px-4 py-2 text-sm">📧 ایمیل</a>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
