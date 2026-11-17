import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbBox, engagementFor, itemKey, toggleEngagement } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";
import { BOX_COOKIE, decodeBox, encodeBox, toggleBox } from "@/lib/engage-box";
import {
  IDENTITY_COOKIE,
  decodeIdentity,
  identityCookieOptions,
  identityFresh,
} from "@/lib/session";

const types = new Set(["video", "audio", "reel"]);

async function actor() {
  const account = await signedInAccount();
  if (account) return { id: account.id, box: false };
  const jar = await cookies();
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (identity && identityFresh(identity)) return { id: "", box: true };
  return null;
}

function boxResponse(boxRaw: string | undefined, keys: string[]) {
  const box = decodeBox(boxRaw);
  const mine: Record<string, { liked: boolean; saved: boolean }> = {};
  const counts: Record<string, number> = {};
  for (const key of keys) {
    const liked = box.likes.includes(key);
    mine[key] = { liked, saved: box.saves.some((item) => item.key === key) };
    counts[key] = liked ? 1 : 0;
  }
  return { counts, mine };
}

async function movedBox(userId: string) {
  const jar = await cookies();
  const raw = jar.get(BOX_COOKIE)?.value;
  if (!raw) return false;
  const box = decodeBox(raw);
  if (!box.likes.length && !box.saves.length) return false;
  return absorbBox(userId, box);
}

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
  const who = await actor();
  const jar = await cookies();
  if (!who) {
    const data = await engagementFor(null, keys);
    return NextResponse.json({ user: null, ...data });
  }
  if (!who.box) {
    const moved = await movedBox(who.id);
    const data = await engagementFor(who.id, keys);
    const res = NextResponse.json({ user: { id: who.id }, ...data });
    if (moved) clearBox(res);
    return res;
  }
  return NextResponse.json({ user: { id: "" }, ...boxResponse(jar.get(BOX_COOKIE)?.value, keys) });
}

export async function POST(req: Request) {
  const who = await actor();
  if (!who) return NextResponse.json({ ok: false, login: true }, { status: 401 });
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
  if (!who.box) {
    const moved = await movedBox(who.id);
    const result = await toggleEngagement(who.id, type as "video" | "audio" | "reel", id, action, meta);
    if (!result) return NextResponse.json({ ok: false }, { status: 500 });
    const res = NextResponse.json({ ok: true, key, ...result });
    if (moved) clearBox(res);
    return res;
  }
  const jar = await cookies();
  const next = toggleBox(decodeBox(jar.get(BOX_COOKIE)?.value), key, action, meta);
  const res = NextResponse.json({
    ok: true,
    key,
    count: next.likes.includes(key) ? 1 : 0,
    liked: next.likes.includes(key),
    saved: next.saves.some((item) => item.key === key),
  });
  res.cookies.set(BOX_COOKIE, encodeBox(next), identityCookieOptions());
  return res;
}
