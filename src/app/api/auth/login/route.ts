import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbCloud, signInUsername } from "@/lib/account-auth";
import { absorbBox, loginWithPassword, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import {
  ACCESS_COOKIE,
  ADMIN_COOKIE,
  IDENTITY_COOKIE,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  adminCookieOptions,
  encodeIdentity,
  identityCookieOptions,
  sessionCookieOptions,
} from "@/lib/session";

function clearBox(res: NextResponse) {
  res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const usernameRaw = String(body.username || "");
  const password = String(body.password || "");
  const result = await loginWithPassword(usernameRaw, password);
  const cloud = await signInUsername(usernameRaw, password);
  if (!result.ok && !cloud) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });

  const username = cloud?.user.username || (result.ok ? result.username : "");
  const role = username === "yasin" || (result.ok && result.role === "admin") || cloud?.user.role === "admin" ? "admin" : "user";
  const res = NextResponse.json({ ok: true, role, username });
  if (result.ok && result.token) res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  if (username) {
    res.cookies.set(IDENTITY_COOKIE, encodeIdentity({ username, role, seen: Date.now() }), identityCookieOptions());
  }
  if (role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  if (cloud?.accessToken) res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
  if (cloud?.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());

  try {
    const jar = await cookies();
    const raw = jar.get(BOX_COOKIE)?.value;
    const box = decodeBox(raw);
    let absorbed = false;
    if (cloud && (box.likes.length || box.saves.length)) absorbed = await absorbCloud(cloud, box);
    if (!absorbed && result.ok && result.username && raw) {
      const userId = await userIdByUsername(result.username);
      if (userId) absorbed = await absorbBox(userId, box);
    }
    if (absorbed) clearBox(res);
  } catch {
    // ورود نباید به خاطر انتقال لایک‌های قبلی شکست بخورد
  }
  return res;
}
