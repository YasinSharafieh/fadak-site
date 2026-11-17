import { NextResponse } from "next/server";
import { verifyLoginCode } from "@/lib/account-store";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await verifyLoginCode(String(body.phone || ""), String(body.code || ""));
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const res = NextResponse.json({ ok: true, needsName: result.needsName });
  res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  return res;
}
