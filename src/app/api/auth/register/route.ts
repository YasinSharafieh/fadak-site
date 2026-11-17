import { NextResponse } from "next/server";
import { finishSignup } from "@/lib/account-store";
import { IDENTITY_COOKIE, SESSION_COOKIE, encodeIdentity, identityCookieOptions, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await finishSignup(
    String(body.ticket || ""),
    String(body.username || ""),
    String(body.password || ""),
    String(body.name || ""),
    String(body.family || ""),
    String(body.city || ""),
  );
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  const res = NextResponse.json({ ok: true, role: result.role, username: result.username });
  res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  res.cookies.set(
    IDENTITY_COOKIE,
    encodeIdentity({ username: result.username, role: "user", seen: Date.now() }),
    identityCookieOptions(),
  );
  return res;
}
