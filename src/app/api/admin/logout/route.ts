import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/account-store";
import { BOX_COOKIE } from "@/lib/engage-box";
import { ADMIN_COOKIE, IDENTITY_COOKIE, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: Request) {
  const jar = await cookies();
  await destroySession(jar.get(SESSION_COOKIE)?.value);
  const res = NextResponse.redirect(new URL("/login", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(IDENTITY_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
