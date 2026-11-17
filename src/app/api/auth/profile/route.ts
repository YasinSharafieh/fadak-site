import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/account-store";
import { signedInAccount } from "@/lib/current-account";

export async function POST(req: Request) {
  const user = await signedInAccount();
  if (!user) return NextResponse.json({ ok: false, error: "وارد حساب شوید." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const result = await updateProfile(user.id, {
    name: String(body.name || ""),
    family: String(body.family || ""),
    city: String(body.city || ""),
  });
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ ok: true, user: result.user });
}
