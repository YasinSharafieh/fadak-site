import { cookies } from "next/headers";
import { userById, userFromToken, userIdByUsername } from "@/lib/account-store";
import { IDENTITY_COOKIE, SESSION_COOKIE, decodeIdentity, identityFresh } from "@/lib/session";

function readCookie(header: string | null | undefined, name: string) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const item = part.trim();
    if (!item.startsWith(`${name}=`)) continue;
    try {
      return decodeURIComponent(item.slice(name.length + 1));
    } catch {
      return item.slice(name.length + 1);
    }
  }
  return undefined;
}

export async function accountFromCookies(session: string | undefined, identityRaw: string | undefined) {
  const fromSession = await userFromToken(session);
  if (fromSession) return fromSession;
  const identity = decodeIdentity(identityRaw);
  if (!identity || !identityFresh(identity)) return null;
  const id = await userIdByUsername(identity.username);
  if (!id) return null;
  return userById(id);
}

export async function signedInAccount(cookieHeader?: string | null) {
  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value || readCookie(cookieHeader, SESSION_COOKIE);
  const identity = jar.get(IDENTITY_COOKIE)?.value || readCookie(cookieHeader, IDENTITY_COOKIE);
  return accountFromCookies(session, identity);
}
