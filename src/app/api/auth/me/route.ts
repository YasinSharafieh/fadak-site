import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbCloud, cloudFromCookies, saveCloudProfile } from "@/lib/account-auth";
import { absorbBox, destroySession, touchSession, userById, userFromToken, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import {
  ACCESS_COOKIE,
  ADMIN_COOKIE,
  IDENTITY_COOKIE,
  PROFILE_COOKIE,
  REFRESH_COOKIE,
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
  res.cookies.set(ACCESS_COOKIE, "", dead);
  res.cookies.set(REFRESH_COOKIE, "", dead);
}

export async function GET() {
  const jar = await cookies();
  const now = Date.now();
  const token = jar.get(SESSION_COOKIE)?.value;
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);

  if (identity && !identityFresh(identity, now)) {
    await destroySession(token);
    const res = NextResponse.json({ user: null, durable: false });
    clearAuth(res);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  let stored = await userFromToken(token);
  if (!stored && identity) {
    const id = await userIdByUsername(identity.username);
    if (id) stored = await userById(id);
  }
  const stamped = decodeSavedProfile(jar.get(PROFILE_COOKIE)?.value);
  if (cloud && stamped?.name && stamped.family && !cloud.user.name) {
    const migrated = await saveCloudProfile(cloud, stamped.name, stamped.family);
    if (migrated) {
      cloud.user = migrated.user;
      cloud.likes = migrated.likes;
      cloud.saves = migrated.saves;
    }
  }

  let moved = false;
  const box = decodeBox(jar.get(BOX_COOKIE)?.value);
  if (cloud && (box.likes.length || box.saves.length)) {
    try {
      moved = await absorbCloud(cloud, box);
    } catch {
      moved = false;
    }
  } else if (stored && (box.likes.length || box.saves.length)) {
    try {
      moved = await absorbBox(stored.id, box);
    } catch {
      moved = false;
    }
  }

  const username = cloud?.user.username || stored?.username || identity?.username || "";
  if (!username) {
    const res = NextResponse.json({ user: null, durable: false });
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (token && stored) await touchSession(token);
  const role: Identity["role"] = username === "yasin" || stored?.role === "admin" || cloud?.user.role === "admin" || identity?.role === "admin" ? "admin" : "user";
  const durable = Boolean(cloud?.user.id || stored?.id);
  const res = NextResponse.json({
    durable,
    user: {
      id: cloud?.user.id || stored?.id || "",
      phone: cloud?.user.phone || stored?.phone || "",
      name: cloud?.user.name || stored?.name || stamped?.name || "",
      family: cloud?.user.family || stored?.family || stamped?.family || "",
      city: cloud?.user.city || stored?.city || stamped?.city || "",
      username,
      role,
    },
  });
  res.cookies.set(IDENTITY_COOKIE, encodeIdentity({ username, role, seen: now }), identityCookieOptions());
  if (token) res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  if (role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  if (cloud?.accessToken) res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
  if (cloud?.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
  if (moved) res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.headers.set("Cache-Control", "no-store");
  return res;
}
