import { createHash } from "node:crypto";
import type { AccountUser } from "@/lib/account-store";
import type { EngageBox, SavedItem } from "@/lib/engage-box";

const LEDGER_EMAIL = "fadak-counts@users.fadak.invalid";
const LIKE_CAP = 400;
const SAVE_CAP = 80;

export type CloudSession = {
  accessToken: string;
  refreshToken: string;
  user: AccountUser;
  likes: string[];
  saves: SavedItem[];
};

type AuthUser = {
  id?: string;
  email?: string;
  app_metadata?: { role?: string };
  user_metadata?: Record<string, unknown>;
};

function projectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function publishableKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
}

export function cloudAuthConfigured() {
  return Boolean(projectUrl() && publishableKey());
}

export function authEmailForUsername(username: string) {
  if (/^[a-z0-9._]+$/.test(username)) return `${username}@users.fadak.invalid`;
  return `u${sha(username).slice(0, 24)}@users.fadak.invalid`;
}

function sha(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeUsername(input: string) {
  const value = input
    .trim()
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200d\u200e\u200f\ufeff]/g, "")
    .replace(/\s+/g, "");
  if (!/^[\u0600-\u06ffa-z0-9._]{3,32}$/.test(value)) return null;
  if (value.startsWith(".") || value.endsWith(".") || value.includes("..")) return null;
  return value;
}

function authHeaders(token?: string) {
  const key = publishableKey();
  return {
    apikey: key,
    Authorization: `Bearer ${token || key}`,
    "Content-Type": "application/json",
  };
}

function tokenExp(token: string | undefined) {
  if (!token) return 0;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8")) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : 0;
  } catch {
    return 0;
  }
}

function asSaves(value: unknown): SavedItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is SavedItem => Boolean(item) && typeof item.key === "string" && typeof item.href === "string")
    .slice(-SAVE_CAP)
    .map((item) => ({
      key: item.key.slice(0, 80),
      title: String(item.title || "بدون عنوان").slice(0, 180),
      href: item.href.startsWith("/") ? item.href.slice(0, 240) : "/",
      thumb: item.thumb ? String(item.thumb).slice(0, 400) : undefined,
    }));
}

function asLikes(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((key): key is string => typeof key === "string" && /^(video|audio|reel):[A-Za-z0-9_-]+$/.test(key)).slice(-LIKE_CAP);
}

function accountFromAuth(raw: AuthUser | undefined, fallbackUsername = ""): CloudSession["user"] & { likes: string[]; saves: SavedItem[] } {
  const meta = raw?.user_metadata || {};
  const emailName = String(raw?.email || "").split("@")[0] || "";
  const username = normalizeUsername(String(meta.username || fallbackUsername || emailName)) || fallbackUsername || emailName;
  const role = username === "yasin" || raw?.app_metadata?.role === "admin" ? "admin" : "user";
  return {
    id: String(raw?.id || ""),
    phone: typeof meta.phone === "string" ? meta.phone : "",
    name: typeof meta.name === "string" ? meta.name : "",
    family: typeof meta.family === "string" ? meta.family : "",
    city: typeof meta.city === "string" ? meta.city : "",
    username,
    role,
    likes: asLikes(meta.likes),
    saves: asSaves(meta.saves),
  };
}

function sessionFromToken(accessToken: string, refreshToken: string, raw: AuthUser | undefined, fallbackUsername = ""): CloudSession {
  const account = accountFromAuth(raw, fallbackUsername);
  const { likes, saves, ...user } = account;
  return { accessToken, refreshToken, user, likes, saves };
}

async function authFetch(path: string, init: RequestInit = {}) {
  if (!cloudAuthConfigured()) return null;
  try {
    return await fetch(`${projectUrl()}${path}`, { ...init, signal: AbortSignal.timeout(8000) });
  } catch {
    return null;
  }
}

async function passwordGrant(email: string, password: string, fallbackUsername = "") {
  const res = await authFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res?.ok) return null;
  const data = (await res.json()) as { access_token?: string; refresh_token?: string; user?: AuthUser };
  if (!data.access_token || !data.refresh_token) return null;
  return sessionFromToken(data.access_token, data.refresh_token, data.user, fallbackUsername);
}

export async function signInUsername(rawUsername: string, password: string) {
  const username = normalizeUsername(rawUsername);
  if (!username || !password || username === "counts") return null;
  return passwordGrant(authEmailForUsername(username), password, username);
}

async function refreshGrant(refreshToken: string) {
  const res = await authFetch("/auth/v1/token?grant_type=refresh_token", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res?.ok) return null;
  const data = (await res.json()) as { access_token?: string; refresh_token?: string; user?: AuthUser };
  if (!data.access_token || !data.refresh_token) return null;
  return { accessToken: data.access_token, refreshToken: data.refresh_token, raw: data.user };
}

async function readAuthUser(accessToken: string) {
  const res = await authFetch("/auth/v1/user", { headers: authHeaders(accessToken) });
  if (!res?.ok) return null;
  return (await res.json()) as AuthUser;
}

export async function cloudFromCookies(access: string | undefined, refresh: string | undefined) {
  if (!cloudAuthConfigured()) return null;
  if (access && tokenExp(access) > Math.floor(Date.now() / 1000) + 45) {
    const raw = await readAuthUser(access);
    if (raw?.id) return sessionFromToken(access, refresh || "", raw);
  }
  if (!refresh) return null;
  const next = await refreshGrant(refresh);
  if (!next) return null;
  const raw = next.raw?.id ? next.raw : await readAuthUser(next.accessToken);
  if (!raw?.id) return null;
  return sessionFromToken(next.accessToken, next.refreshToken, raw);
}

async function updateMeta(accessToken: string, data: Record<string, unknown>) {
  const res = await authFetch("/auth/v1/user", {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ data }),
  });
  if (!res?.ok) return null;
  return (await res.json()) as AuthUser;
}

export async function saveCloudProfile(session: CloudSession, name: string, family: string) {
  const raw = await updateMeta(session.accessToken, {
    username: session.user.username,
    phone: session.user.phone,
    name,
    family,
    city: session.user.city || "",
  });
  if (!raw?.id) return null;
  return sessionFromToken(session.accessToken, session.refreshToken, raw, session.user.username);
}

export async function absorbCloud(session: CloudSession, box: EngageBox) {
  if (!box.likes.length && !box.saves.length) return false;
  const likes = [...session.likes];
  const saves = [...session.saves];
  const added: string[] = [];
  for (const key of box.likes) {
    if (!likes.includes(key)) {
      likes.push(key);
      added.push(key);
    }
  }
  for (const item of box.saves) {
    if (!item?.key || saves.some((saved) => saved.key === item.key)) continue;
    saves.push({
      key: item.key,
      title: item.title || "بدون عنوان",
      href: item.href?.startsWith("/") ? item.href : "/",
      thumb: item.thumb,
    });
  }
  if (!added.length && saves.length === session.saves.length) return false;
  const raw = await updateMeta(session.accessToken, {
    username: session.user.username,
    likes: likes.slice(-LIKE_CAP),
    saves: saves.slice(-SAVE_CAP),
  });
  if (!raw?.id) return false;
  session.likes = asLikes(raw.user_metadata?.likes);
  session.saves = asSaves(raw.user_metadata?.saves);
  for (const key of added) await adjustCount(key, 1);
  return true;
}

export async function toggleCloudEngage(
  session: CloudSession,
  key: string,
  action: "like" | "save",
  meta: SavedItem,
) {
  const likes = [...session.likes];
  const saves = [...session.saves];
  let delta = 0;
  if (action === "like") {
    if (likes.includes(key)) {
      likes.splice(likes.indexOf(key), 1);
      delta = -1;
    } else {
      likes.push(key);
      delta = 1;
    }
  } else if (saves.some((item) => item.key === key)) {
    saves.splice(saves.findIndex((item) => item.key === key), 1);
  } else {
    saves.push(meta);
  }
  const raw = await updateMeta(session.accessToken, {
    username: session.user.username,
    likes: likes.slice(-LIKE_CAP),
    saves: saves.slice(-SAVE_CAP),
  });
  if (!raw?.id) return null;
  const count = delta === 0 ? await readCount(key) : await adjustCount(key, delta);
  return {
    count,
    liked: likes.includes(key),
    saved: saves.some((item) => item.key === key),
    likes,
    saves,
  };
}

export async function removeCloudSave(session: CloudSession, key: string) {
  if (!/^(video|audio|reel):[A-Za-z0-9_-]+$/.test(key)) return null;
  const saves = session.saves.filter((item) => item.key !== key);
  const raw = await updateMeta(session.accessToken, {
    username: session.user.username,
    saves,
  });
  if (!raw?.id) return null;
  return asSaves(raw.user_metadata?.saves);
}

let countsCache: { at: number; items: Record<string, number> } | null = null;

async function ledgerSession() {
  return passwordGrant(LEDGER_EMAIL, publishableKey(), "counts");
}

async function loadCounts() {
  if (countsCache && Date.now() - countsCache.at < 15000) return countsCache.items;
  const session = await ledgerSession();
  const items = session ? ((await readAuthUser(session.accessToken))?.user_metadata?.items as Record<string, number> | undefined) : undefined;
  const safe: Record<string, number> = {};
  if (items && typeof items === "object") {
    for (const [key, value] of Object.entries(items)) {
      if (/^(video|audio|reel):[A-Za-z0-9_-]+$/.test(key) && Number.isFinite(value)) safe[key] = Math.max(0, Math.floor(value));
    }
  }
  countsCache = { at: Date.now(), items: safe };
  return safe;
}

export async function readCounts(keys: string[]) {
  const items = await loadCounts();
  const picked: Record<string, number> = {};
  for (const key of keys) picked[key] = items[key] || 0;
  return picked;
}

export async function readCount(key: string) {
  const items = await readCounts([key]);
  return items[key] || 0;
}

export async function adjustCount(key: string, delta: number) {
  if (!delta) return readCount(key);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const session = await ledgerSession();
    if (!session) break;
    const raw = await readAuthUser(session.accessToken);
    const current = raw?.user_metadata || {};
    const items = { ...((current.items as Record<string, number> | undefined) || {}) };
    const version = Number(current.version || 0);
    items[key] = Math.max(0, Math.floor(items[key] || 0) + delta);
    const updated = await updateMeta(session.accessToken, { kind: "counts", version: version + 1, items });
    if (Number(updated?.user_metadata?.version) === version + 1) {
      countsCache = { at: Date.now(), items: { ...items } };
      return items[key];
    }
  }
  countsCache = null;
  return readCount(key);
}

export async function revokeCloud(accessToken: string | undefined) {
  if (!accessToken) return;
  await authFetch("/auth/v1/logout", { method: "POST", headers: authHeaders(accessToken) });
}
