import { NextResponse } from "next/server";
import { finishSignup } from "@/lib/account-store";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await finishSignup(String(body.ticket || ""), String(body.username || ""), String(body.password || ""));
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const res = NextResponse.json({ ok: true, role: result.role });
  res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return res;
}
