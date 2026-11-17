import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { engagementFor, itemKey, toggleEngagement, userFromToken, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox, encodeBox, toggleBox } from "@/lib/engage-box";
import {
  IDENTITY_COOKIE,
  decodeIdentity,
  identityCookieOptions,
  identityFresh,
  readSessionToken,
} from "@/lib/session";

const types = new Set(["video", "audio", "reel"]);

async function actor() {
  const token = await readSessionToken();
  const stored = await userFromToken(token);
  const jar = await cookies();
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  const named = identity && identityFresh(identity) ? identity : null;
  if (stored) return { id: stored.id, name: stored.name, box: false };
  if (named) {
    const id = await userIdByUsername(named.username);
    if (id) return { id, name: named.username, box: false };
    return { id: "", name: named.username, box: true };
  }
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
    const data = await engagementFor(who.id, keys);
    return NextResponse.json({ user: { id: who.id, name: who.name }, ...data });
  }
  return NextResponse.json({ user: { id: "", name: who.name }, ...boxResponse(jar.get(BOX_COOKIE)?.value, keys) });
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
    const result = await toggleEngagement(who.id, type as "video" | "audio" | "reel", id, action, meta);
    if (!result) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true, key, ...result });
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
