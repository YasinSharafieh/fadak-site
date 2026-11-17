import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { absorbBox, loginWithPassword, userIdByUsername } from "@/lib/account-store";
import { BOX_COOKIE, decodeBox } from "@/lib/engage-box";
import {
  ADMIN_COOKIE,
  IDENTITY_COOKIE,
  SESSION_COOKIE,
  adminCookieOptions,
  encodeIdentity,
  identityCookieOptions,
  sessionCookieOptions,
} from "@/lib/session";

function clearBox(res: NextResponse) {
  res.cookies.set(BOX_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await loginWithPassword(String(body.username || ""), String(body.password || ""));
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  const res = NextResponse.json({ ok: true, role: result.role, username: result.username });
  if (result.token) res.cookies.set(SESSION_COOKIE, result.token, sessionCookieOptions());
  if (result.username) {
    res.cookies.set(
      IDENTITY_COOKIE,
      encodeIdentity({ username: result.username, role: result.role, seen: Date.now() }),
      identityCookieOptions(),
    );
  }
  if (result.role === "admin") res.cookies.set(ADMIN_COOKIE, "authenticated", adminCookieOptions());
  try {
    const jar = await cookies();
    const raw = jar.get(BOX_COOKIE)?.value;
    const userId = result.username ? await userIdByUsername(result.username) : null;
    if (userId && raw) {
      const absorbed = await absorbBox(userId, decodeBox(raw));
      if (absorbed) clearBox(res);
    }
  } catch {
    // ورود نباید به خاطر انتقال لایک‌های قبلی شکست بخورد
  }
  return res;
}
