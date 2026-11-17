import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbBox, destroySession, touchSession, userById, userFromToken, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import {
  ADMIN_COOKIE,
  IDENTITY_COOKIE,
  PROFILE_COOKIE,
  SESSION_COOKIE,
  adminCookieOptions,
  decodeIdentity,
  decodeSavedProfile,
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
  res.cookies.set(BOX_COOKIE, "", dead);
  res.cookies.set(PROFILE_COOKIE, "", dead);
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

  let stored = await userFromToken(token);
  if (!stored && identity) {
    const id = await userIdByUsername(identity.username);
    if (id) stored = await userById(id);
  }
  const username = stored?.username || identity?.username || "";
  if (!username) {
    const res = NextResponse.json({ user: null });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (token && stored) await touchSession(token);
  let moved = false;
  if (stored) {
    const box = decodeBox(jar.get(BOX_COOKIE)?.value);
    if (box.likes.length || box.saves.length) {
      try {
        moved = await absorbBox(stored.id, box);
      } catch {
        moved = false;
      }
    }
  }
  const role: Identity["role"] = stored?.role === "admin" || identity?.role === "admin" ? "admin" : "user";
  const stamped = decodeSavedProfile(jar.get(PROFILE_COOKIE)?.value);
  const res = NextResponse.json({
    user: {
      id: stored?.id || "",
      phone: stored?.phone || "",
      name: stored?.name || stamped?.name || "",
      family: stored?.family || stamped?.family || "",
      city: stored?.city || stamped?.city || "",
      username,
      role,
    },
  });
  res.cookies.set(IDENTITY_COOKIE, encodeIdentity({ username, role, seen: now }), identityCookieOptions());
  if (token) res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  if (role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  if (moved) res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
