import { NextResponse } from "next/server";
import { signInUsername } from "@/lib/account-auth";
import { finishSignup } from "@/lib/account-store";
import { ACCESS_COOKIE, IDENTITY_COOKIE, REFRESH_COOKIE, SESSION_COOKIE, encodeIdentity, identityCookieOptions, sessionCookieOptions } from "@/lib/session";

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
  const cloud = await signInUsername(result.username, String(body.password || ""));
  const res = NextResponse.json({ ok: true, role: result.role, username: result.username });
  if (result.token) res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  res.cookies.set(
    IDENTITY_COOKIE,
    encodeIdentity({ username: result.username, role: "user", seen: Date.now() }),
    identityCookieOptions(),
  );
  if (cloud?.accessToken) res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
  if (cloud?.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
  return res;
}
