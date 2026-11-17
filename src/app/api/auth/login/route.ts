import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/account-store";
import { ADMIN_COOKIE, SESSION_COOKIE, adminCookieOptions, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await loginWithPassword(String(body.username || ""), String(body.password || ""));
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  const res = NextResponse.json({ ok: true, role: result.role });
  if (result.token) res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  if (result.role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  return res;
}
