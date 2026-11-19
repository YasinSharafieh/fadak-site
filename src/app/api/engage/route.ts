import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbCloud, cloudFromCookies, readCounts, toggleCloudEngage } from "@/lib/account-auth";
import { absorbBox, engagementFor, itemKey, mirrorEngagement, toggleEngagement } from "@/lib/account-store";
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

const types = new Set(["video", "audio", "reel"]);

function clearBox(res: NextResponse) {
  res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keys = (url.searchParams.get("keys") || "")
    .split(",")
    .map((key) => key.trim())
    .filter((key) => /^(video|audio|reel):[A-Za-z0-9_-]+$/.test(key))
    .slice(0, 80);
  const jar = await cookies();
  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  const stored = cloud ? null : await signedInAccount();
  const counts = await readCounts(keys);
  const mine: Record<string, { liked: boolean; saved: boolean }> = {};
  const likes = cloud?.likes || [];
  const saves = cloud?.saves || [];
  if (cloud || stored) {
    const data = stored ? await engagementFor(stored.id, keys) : null;
    for (const key of keys) {
      mine[key] = {
        liked: cloud ? likes.includes(key) : Boolean(data?.mine[key]?.liked),
        saved: cloud ? saves.some((item) => item.key === key) : Boolean(data?.mine[key]?.saved),
      };
      if (!counts[key] && data?.counts[key]) counts[key] = data.counts[key];
    }
    const res = NextResponse.json({ user: { id: cloud?.user.id || stored?.id || "" }, counts, mine });
    if (cloud?.accessToken) res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
    if (cloud?.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  const box = identity && identityFresh(identity) ? decodeBox(jar.get(BOX_COOKIE)?.value) : null;
  for (const key of keys) {
    mine[key] = {
      liked: Boolean(box?.likes.includes(key)),
      saved: Boolean(box?.saves.some((item) => item.key === key)),
    };
  }
  const res = NextResponse.json({ user: box ? { id: "" } : null, counts, mine });
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: Request) {
  const jar = await cookies();
  const cloud = await cloudFromCookies(jar.get(ACCESS_COOKIE)?.value, jar.get(REFRESH_COOKIE)?.value);
  const stored = cloud ? null : await signedInAccount();
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (!cloud && !stored) {
    if (identity && identityFresh(identity)) {
      return NextResponse.json({ ok: false, login: true, error: "برای ماندن لایک، یک بار دوباره وارد شوید." }, { status: 401 });
    }
    return NextResponse.json({ ok: false, login: true }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "");
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!types.has(type) || !/^[A-Za-z0-9_-]+$/.test(id) || (action !== "like" && action !== "save")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const key = itemKey(type, id);
  const meta = {
    key,
    title: String(body.title || "").slice(0, 180) || "بدون عنوان",
    href: String(body.href || "/").startsWith("/") ? String(body.href || "/") : "/",
    thumb: body.thumb ? String(body.thumb).slice(0, 400) : undefined,
  };

  if (cloud) {
    const box = decodeBox(jar.get(BOX_COOKIE)?.value);
    if (box.likes.length || box.saves.length) {
      try {
        await absorbCloud(cloud, box);
      } catch {
        // لایک جدید نباید به خاطر جعبهٔ قبلی شکست بخورد
      }
    }
    const result = await toggleCloudEngage(cloud, key, action, meta);
    if (!result) return NextResponse.json({ ok: false }, { status: 500 });
    try {
      await mirrorEngagement(cloud.user.id, result.likes, result.saves);
    } catch {
      // آینهٔ ذخیره‌سازی اختیاری است؛ حساب ابری منبع اصلی است
    }
    const res = NextResponse.json({ ok: true, key, count: result.count, liked: result.liked, saved: result.saved });
    res.cookies.set(ACCESS_COOKIE, cloud.accessToken, identityCookieOptions());
    if (cloud.refreshToken) res.cookies.set(REFRESH_COOKIE, cloud.refreshToken, identityCookieOptions());
    if (box.likes.length || box.saves.length) clearBox(res);
    return res;
  }

  const moved = stored ? await absorbBox(stored.id, decodeBox(jar.get(BOX_COOKIE)?.value)).catch(() => false) : false;
  const result = await toggleEngagement(stored!.id, type as "video" | "audio" | "reel", id, action, meta);
  if (!result) return NextResponse.json({ ok: false }, { status: 500 });
  const res = NextResponse.json({ ok: true, key, ...result });
  if (moved) clearBox(res);
  return res;
}
