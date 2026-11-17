import { NextResponse } from "next/server";
import { destroySession } from "@/lib/account-store";
import { BOX_COOKIE } from "@/lib/engage-box";
import { ADMIN_COOKIE, IDENTITY_COOKIE, PROFILE_COOKIE, SESSION_COOKIE, readSessionToken } from "@/lib/session";

export async function POST() {
  await destroySession(await readSessionToken());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(IDENTITY_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(PROFILE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
