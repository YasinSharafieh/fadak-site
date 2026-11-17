import { connection } from "next/server";
import { NextResponse } from "next/server";
import { cleanLabel, updateProfile } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";
import {
  IDENTITY_COOKIE,
  PROFILE_COOKIE,
  decodeIdentity,
  encodeSavedProfile,
  identityCookieOptions,
  identityFresh,
} from "@/lib/session";

function readCookie(header: string | null, name: string) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const item = part.trim();
    if (!item.startsWith(`${name}=`)) continue;
    try {
      return decodeURIComponent(item.slice(name.length + 1));
    } catch {
      return item.slice(name.length + 1);
    }
  }
  return undefined;
}

export async function POST(req: Request) {
  await connection();
  const header = req.headers.get("cookie");
  const identity = decodeIdentity(readCookie(header, IDENTITY_COOKIE));
  const user = await signedInAccount(header);
  if (!user && (!identity || !identityFresh(identity))) {
    return NextResponse.json({ ok: false, error: "وارد حساب شوید." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const name = cleanLabel(String(body.name || ""), 40);
  const family = cleanLabel(String(body.family || ""), 40);
  if (!name || !family) return NextResponse.json({ ok: false, error: "نام و نام خانوادگی را کامل وارد کنید." }, { status: 400 });

  let stored: Awaited<ReturnType<typeof updateProfile>> | null = null;
  if (user) {
    try {
      stored = await updateProfile(user.id, { name, family });
    } catch {
      stored = null;
    }
  }
  const saved = stored?.ok ? stored.user : {
    id: user?.id || "",
    phone: user?.phone || "",
    name,
    family,
    city: user?.city || "",
    username: user?.username || identity?.username || "",
    role: user?.role || identity?.role || "user",
  };
  const res = NextResponse.json({ ok: true, user: saved });
  res.cookies.set(PROFILE_COOKIE, encodeSavedProfile({ name, family, city: user?.city || "" }), identityCookieOptions());
  return res;
}
