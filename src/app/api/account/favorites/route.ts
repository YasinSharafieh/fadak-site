import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { favoritesOf, userFromToken, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import { IDENTITY_COOKIE, decodeIdentity, identityFresh, readSessionToken } from "@/lib/session";

export async function GET() {
  const stored = await userFromToken(await readSessionToken());
  if (stored) {
    const items = await favoritesOf(stored.id);
    return NextResponse.json({ ok: true, user: stored, items });
  }
  const jar = await cookies();
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (!identity || !identityFresh(identity)) return NextResponse.json({ ok: false }, { status: 401 });
  const userId = await userIdByUsername(identity.username);
  if (userId) {
    const items = await favoritesOf(userId);
    return NextResponse.json({
      ok: true,
      user: { id: userId, phone: "", name: "", city: "", username: identity.username, role: identity.role },
      items,
    });
  }
  return NextResponse.json({
    ok: true,
    user: { id: "", phone: "", name: "", city: "", username: identity.username, role: identity.role },
    items: decodeBox(jar.get(BOX_COOKIE)?.value).saves,
  });
}
