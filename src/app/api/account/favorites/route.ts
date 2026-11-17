import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { favoritesOf, removeSave } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import { IDENTITY_COOKIE, decodeIdentity, identityFresh } from "@/lib/session";

export async function GET() {
  const user = await signedInAccount();
  if (user) {
    const items = await favoritesOf(user.id);
    return NextResponse.json({ ok: true, user, items });
  }
  const jar = await cookies();
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (!identity || !identityFresh(identity)) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({
    ok: true,
    user: { id: "", phone: "", name: "", family: "", city: "", username: identity.username, role: identity.role },
    items: decodeBox(jar.get(BOX_COOKIE)?.value).saves,
  });
}

export async function DELETE(req: Request) {
  const user = await signedInAccount();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const key = new URL(req.url).searchParams.get("key") || "";
  const items = await removeSave(user.id, key);
  if (!items) return NextResponse.json({ ok: false }, { status: 400 });
  return NextResponse.json({ ok: true, items });
}
