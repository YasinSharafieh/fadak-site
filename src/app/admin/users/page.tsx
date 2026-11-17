import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listAccounts } from "@/lib/account-store";
import { displayIranMobile } from "@/lib/phone";

export const instant = false;

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") redirect("/admin/login");
  const users = await listAccounts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/admin" className="text-sm text-[#14a3a2] hover:underline">← بازگشت به داشبورد</Link>
      <h1 className="mt-3 text-3xl font-extrabold">کاربران</h1>
      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-[#111] text-white/70">
            <tr>
              <th className="px-4 py-3 text-right">نام کاربری</th>
              <th className="px-4 py-3 text-right">نام</th>
              <th className="px-4 py-3 text-right">موبایل</th>
              <th className="px-4 py-3 text-right">شهر</th>
              <th className="px-4 py-3 text-right">لایک</th>
              <th className="px-4 py-3 text-right">علاقه‌مندی</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/50">هنوز کاربری ثبت‌نام نکرده.</td></tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="border-t border-white/10">
                <td className="px-4 py-3">{user.username || "—"}</td>
                <td className="px-4 py-3">{user.name || "—"}</td>
                <td className="px-4 py-3" dir="ltr">{user.phone ? displayIranMobile(user.phone) : "—"}</td>
                <td className="px-4 py-3">{user.city || "—"}</td>
                <td className="px-4 py-3">{user.likes}</td>
                <td className="px-4 py-3">{user.saves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
