import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cloudFromCookies, removeCloudSave } from "@/lib/account-auth";
import { favoritesOf, mirrorEngagement, removeSave } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import {
  ACCESS_COOKIE,
  IDENTITY_COOKIE,
  REFRESH_COOKIE,
  decodeIdentity,
  identityCookieOptions,
  identityFresh,
} from "@/lib/session";

export async function GET() {
  const jar = await cookies();
  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  if (cloud) {
    const res = NextResponse.json({ ok: true, user: cloud.user, items: cloud.saves });
    res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
    if (cloud.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
    res.headers.set("Cache-Control", "no-store");
    return res;
  }
  const user = await signedInAccount();
  if (user) {
    const items = await favoritesOf(user.id);
    return NextResponse.json({ ok: true, user, items });
  }
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (!identity || !identityFresh(identity)) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({
    ok: true,
    user: { id: "", phone: "", name: "", family: "", city: "", username: identity.username, role: identity.role },
    items: decodeBox(jar.get(BOX_COOKIE)?.value).saves,
  });
}

export async function DELETE(req: Request) {
  const jar = await cookies();
  const key = new URL(req.url).searchParams.get("key") || "";
  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  if (cloud) {
    const items = await removeCloudSave(cloud, key);
    if (!items) return NextResponse.json({ ok: false }, { status: 400 });
    try {
      await mirrorEngagement(cloud.user.id, cloud.likes, items);
    } catch {
      // حذف از حساب ابری انجام شده است
    }
    const res = NextResponse.json({ ok: true, items });
    res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
    if (cloud.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
    return res;
  }
  const user = await signedInAccount();
  if (!user) return NextResponse.json({ ok: false, error: "برای حذف، یک بار دوباره وارد شوید." }, { status: 401 });
  const items = await removeSave(user.id, key);
  if (!items) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: true, items });
}
