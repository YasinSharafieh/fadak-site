import { connection } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cloudFromCookies, saveCloudProfile } from "@/lib/account-auth";
import { cleanLabel, updateProfile } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";
import {
  ACCESS_COOKIE,
  IDENTITY_COOKIE,
  PROFILE_COOKIE,
  REFRESH_COOKIE,
  decodeIdentity,
  encodeSavedProfile,
  identityCookieOptions,
  identityFresh,
} from "@/lib/session";

const REAUTH = "برای ذخیره روی حساب، یک بار خارج شوید و دوباره وارد شوید.";

export async function POST(req: Request) {
  await connection();
  const jar = await cookies();
  const header = req.headers.get("cookie");
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  const user = await signedInAccount(header);
  if (!cloud && !user && (!identity || !identityFresh(identity))) {
    return NextResponse.json({ ok: false, error: "وارد حساب شوید." }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const name = cleanLabel(String(body.name || ""), 40);
  const family = cleanLabel(String(body.family || ""), 40);
  if (!name || !family) return NextResponse.json({ ok: false, error: "نام و نام خانوادگی را کامل وارد کنید." }, { status: 400 });
  if (!cloud && !user?.id) return NextResponse.json({ ok: false, error: REAUTH }, { status: 401 });

  const savedCloud = cloud ? await saveCloudProfile(cloud, name, family) : null;
  if (cloud && !savedCloud) return NextResponse.json({ ok: false, error: "ذخیره انجام نشد." }, { status: 500 });

  let stored: Awaited<ReturnType<typeof updateProfile>> | null = null;
  const storedId = user?.id || savedCloud?.user.id || "";
  if (storedId) {
    try {
      stored = await updateProfile(storedId, { name, family });
    } catch {
      stored = null;
    }
  }
  if (!savedCloud && !stored?.ok) return NextResponse.json({ ok: false, error: REAUTH }, { status: 401 });

  const saved = savedCloud?.user || stored?.user || {
    id: storedId,
    phone: user?.phone || "",
    name,
    family,
    city: user?.city || "",
    username: user?.username || identity?.username || "",
    role: user?.role || identity?.role || "user",
  };
  const res = NextResponse.json({ ok: true, user: { ...saved, name, family }, durable: true });
  res.cookies.set(PROFILE_COOKIE, encodeSavedProfile({ name, family, city: saved.city || "" }), identityCookieOptions());
  if (savedCloud?.accessToken) res.cookies.set(ACCESS_COOKIE, savedCloud.accessToken, identityCookieOptions());
  if (savedCloud?.refreshToken) res.cookies.set(REFRESH_COOKIE, savedCloud.refreshToken, identityCookieOptions());
  return res;
}
