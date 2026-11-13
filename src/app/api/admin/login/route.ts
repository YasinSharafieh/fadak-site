import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const form = await req.formData();
  const username = form.get("username")?.toString();
  const password = form.get("password")?.toString();

  if (username === "yasin" && password === "fadak") {
    const cookieStore = await cookies();
    cookieStore.set("fadak_admin", "authenticated", { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
