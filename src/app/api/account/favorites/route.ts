import { NextResponse } from "next/server";
import { favoritesOf, userFromToken } from "@/lib/account-store";
import { readSessionToken } from "@/lib/session";

export async function GET() {
  const user = await userFromToken(await readSessionToken());
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const items = await favoritesOf(user.id);
  return NextResponse.json({ ok: true, user, items });
}
