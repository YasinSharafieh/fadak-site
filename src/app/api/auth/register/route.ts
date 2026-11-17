import { NextResponse } from "next/server";
import { finishSignup, normalizeUsername } from "@/lib/account-store";
import { IDENTITY_COOKIE, SESSION_COOKIE, encodeIdentity, identityCookieOptions, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await finishSignup(String(body.ticket || ""), String(body.username || ""), String(body.password || ""));
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const username = normalizeUsername(String(body.username || "")) || "";
  const res = NextResponse.json({ ok: true, role: result.role, username });
  res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  if (username) {
    res.cookies.set(IDENTITY_COOKIE, encodeIdentity({ username, role: "user", seen: Date.now() }), identityCookieOptions());
  }
  return res;
}
