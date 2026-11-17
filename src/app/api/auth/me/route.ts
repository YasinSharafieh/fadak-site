import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession, touchSession, userFromToken } from "@/lib/account-store";
import {
  ADMIN_COOKIE,
  IDENTITY_COOKIE,
  SESSION_COOKIE,
  adminCookieOptions,
  decodeIdentity,
  encodeIdentity,
  identityCookieOptions,
  identityFresh,
  sessionCookieOptions,
  type Identity,
} from "@/lib/session";

function clearAuth(res: NextResponse) {
  const dead = { httpOnly: true, path: "/", maxAge: 0 };
  res.cookies.set(IDENTITY_COOKIE, "", dead);
  res.cookies.set(SESSION_COOKIE, "", dead);
  res.cookies.set(ADMIN_COOKIE, "", dead);
}

export async function GET() {
  const jar = await cookies();
  const now = Date.now();
  const token = jar.get(SESSION_COOKIE)?.value;
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);

  if (identity && !identityFresh(identity, now)) {
    await destroySession(token);
    const res = NextResponse.json({ user: null });
    clearAuth(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const stored = await userFromToken(token);
  const username = stored?.username || identity?.username || "";
  if (!username) {
    const res = NextResponse.json({ user: null });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (token && stored) await touchSession(token);
  const role: Identity["role"] = stored?.role === "admin" || identity?.role === "admin" ? "admin" : "user";
  const res = NextResponse.json({
    user: {
      id: stored?.id || "",
      phone: stored?.phone || "",
      name: stored?.name || "",
      city: stored?.city || "",
      username,
      role,
    },
  });
  res.cookies.set(IDENTITY_COOKIE, encodeIdentity({ username, role, seen: now }), identityCookieOptions());
  if (token) res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  if (role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  res.headers.set("Cache-Control", "no-store");
  return res;
}
