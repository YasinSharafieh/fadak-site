import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminPasswordOk } from "@/lib/account-store";
import { ADMIN_COOKIE, IDENTITY_COOKIE, adminCookieOptions, encodeIdentity, identityCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = form.get("username")?.toString();
  const password = form.get("password")?.toString();

  if (adminPasswordOk(username, password)) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
    cookieStore.set(IDENTITY_COOKIE, encodeIdentity({ username: "yasin", role: "admin", seen: Date.now() }), identityCookieOptions());
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
