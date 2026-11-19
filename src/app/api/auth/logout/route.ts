import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeCloud } from "@/lib/account-auth";
import { destroySession } from "@/lib/account-store";
import { BOX_COOKIE } from "@/lib/engage-box";
import { ACCESS_COOKIE, ADMIN_COOKIE, IDENTITY_COOKIE, PROFILE_COOKIE, REFRESH_COOKIE, SESSION_COOKIE, readSessionToken } from "@/lib/session";

export async function POST() {
  const jar = await cookies();
  await destroySession(await readSessionToken());
  await revokeCloud(jar.get(ACCESS_COOKIE)?.value);
  const res = NextResponse.json({ ok: true });
  const dead = { httpOnly: true, path: "/", maxAge: 0 };
  res.cookies.set(SESSION_COOKIE, "", dead);
  res.cookies.set(IDENTITY_COOKIE, "", dead);
  res.cookies.set(BOX_COOKIE, "", dead);
  res.cookies.set(PROFILE_COOKIE, "", dead);
  res.cookies.set(ADMIN_COOKIE, "", dead);
  res.cookies.set(ACCESS_COOKIE, "", dead);
  res.cookies.set(REFRESH_COOKIE, "", dead);
  return res;
}
