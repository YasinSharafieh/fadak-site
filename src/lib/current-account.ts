import { cookies } from "next/headers";
import { userById, userFromToken, userIdByUsername } from "@/lib/account-store";
import { IDENTITY_COOKIE, SESSION_COOKIE, decodeIdentity, identityFresh } from "@/lib/session";

export async function signedInAccount() {
  const jar = await cookies();
  const fromSession = await userFromToken(jar.get(SESSION_COOKIE)?.value);
  if (fromSession) return fromSession;
  const identity = decodeIdentity(jar.get(IDENTITY_COOKIE)?.value);
  if (!identity || !identityFresh(identity)) return null;
  const id = await userIdByUsername(identity.username);
  if (!id) return null;
  return userById(id);
}
