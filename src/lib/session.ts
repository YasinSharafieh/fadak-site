import { cookies } from "next/headers";

export const SESSION_COOKIE = "fadak_session";
export const ADMIN_COOKIE = "fadak_admin";
export const IDENTITY_COOKIE = "fadak_identity";
export const IDLE_SECONDS = 7 * 24 * 60 * 60;
export const IDLE_MS = IDLE_SECONDS * 1000;

export type Identity = { username: string; role: "user" | "admin"; seen: number };

export async function readSessionToken() {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: IDLE_SECONDS,
  };
}

export function identityCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: IDLE_SECONDS,
  };
}

export function encodeIdentity(value: Identity) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

export function decodeIdentity(raw: string | undefined): Identity | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<Identity>;
    if (!data.username || typeof data.seen !== "number") return null;
    if (data.role !== "admin" && data.role !== "user") return null;
    return { username: String(data.username), role: data.role, seen: data.seen };
  } catch {
    return null;
  }
}

export function identityFresh(value: Identity, now = Date.now()) {
  return now - value.seen < IDLE_MS;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
