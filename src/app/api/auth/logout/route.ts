import { NextResponse } from "next/server";
import { destroySession } from "@/lib/account-store";
import { SESSION_COOKIE, readSessionToken } from "@/lib/session";

export async function POST() {
  await destroySession(await readSessionToken());
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...{ httpOnly: true, path: "/" }, maxAge: 0 });
  return res;
}
