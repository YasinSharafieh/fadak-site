import { NextResponse } from "next/server";
import { updateProfile, userFromToken } from "@/lib/account-store";
import { readSessionToken } from "@/lib/session";

export async function POST(req: Request) {
  const user = await userFromToken(await readSessionToken());
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const next = await updateProfile(user.id, { name: String(body.name || ""), city: String(body.city || "") });
  return NextResponse.json({ ok: true, user: next });
}
