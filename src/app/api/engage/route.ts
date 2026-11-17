import { NextResponse } from "next/server";
import { engagementFor, itemKey, toggleEngagement, userFromToken } from "@/lib/account-store";
import { readSessionToken } from "@/lib/session";

const types = new Set(["video", "audio", "reel"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const keys = (url.searchParams.get("keys") || "")
    .split(",")
    .map((key) => key.trim())
    .filter((key) => /^(video|audio|reel):[A-Za-z0-9_-]+$/.test(key))
    .slice(0, 80);
  const user = await userFromToken(await readSessionToken());
  const data = await engagementFor(user?.id || null, keys);
  return NextResponse.json({ user: user ? { id: user.id, name: user.name } : null, ...data });
}

export async function POST(req: Request) {
  const user = await userFromToken(await readSessionToken());
  if (!user) return NextResponse.json({ ok: false, login: true }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const type = String(body.type || "");
  const id = String(body.id || "");
  const action = String(body.action || "");
  if (!types.has(type) || !/^[A-Za-z0-9_-]+$/.test(id) || (action !== "like" && action !== "save")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const result = await toggleEngagement(user.id, type as "video" | "audio" | "reel", id, action, {
    title: String(body.title || "").slice(0, 180),
    href: String(body.href || "/").startsWith("/") ? String(body.href || "/") : "/",
    thumb: body.thumb ? String(body.thumb).slice(0, 400) : undefined,
  });
  if (!result) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, key: itemKey(type, id), ...result });
}
