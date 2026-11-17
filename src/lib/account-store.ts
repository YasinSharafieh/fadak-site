import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { normalizeIranMobile } from "@/lib/phone";

const BUCKET = "accounts";
const OTP_TTL_MS = 5 * 60 * 1000;
const SESSION_TTL_MS = 60 * 24 * 60 * 60 * 1000;

export type AccountUser = {
  id: string;
  phone: string;
  name: string;
  city: string;
};

type Profile = AccountUser & {
  version: number;
  likes: string[];
  saves: { key: string; title: string; href: string; thumb?: string }[];
};

type CountsFile = { version: number; items: Record<string, number> };
type OtpFile = { hash: string; expires: number; attempts: number; sentAt: number };
type SessionFile = { userId: string; expires: number };

function serviceKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function projectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function authHeaders() {
  const key = serviceKey();
  return { apikey: key, Authorization: `Bearer ${key}` };
}

export function accountsConfigured() {
  return Boolean(serviceKey() && projectUrl());
}

async function ensureBucket() {
  const res = await fetch(`${projectUrl()}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  });
  if (!res.ok && res.status !== 409 && res.status !== 400) {
    const text = await res.text();
    if (!text.includes("already exists") && !text.includes("Duplicate")) {
      // باکت از قبل ساخته شده؛ خطاهای تکراری را نادیده می‌گیریم
    }
  }
}

async function readJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${projectUrl()}/storage/v1/object/${BUCKET}/${path}`, { headers: authHeaders(), cache: "no-store" });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function writeJson(path: string, value: unknown) {
  await ensureBucket();
  const res = await fetch(`${projectUrl()}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json", "x-upsert": "true" },
    body: JSON.stringify(value),
  });
  if (!res.ok) throw new Error(await res.text());
}

async function removeObject(path: string) {
  await fetch(`${projectUrl()}/storage/v1/object/${BUCKET}/${path}`, { method: "DELETE", headers: authHeaders() });
}

function sha(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function otpHash(phone: string, code: string) {
  return sha(`${phone}:${code}:fadak-otp`);
}

export function itemKey(type: string, id: string) {
  return `${type}:${id}`;
}

export async function sendLoginCode(rawPhone: string) {
  const phone = normalizeIranMobile(rawPhone);
  if (!phone) return { ok: false as const, error: "شماره موبایل معتبر نیست." };
  if (!accountsConfigured()) return { ok: false as const, error: "ورود فعلاً به پایگاه وصل نیست." };

  const existing = await readJson<OtpFile>(`otp/${phone}.json`);
  if (existing && Date.now() - existing.sentAt < 60_000) {
    return { ok: false as const, error: "کد قبلی هنوز معتبر است. یک دقیقه دیگر دوباره تلاش کنید." };
  }

  const code = String(randomInt(10000, 100000));
  await writeJson(`otp/${phone}.json`, {
    hash: otpHash(phone, code),
    expires: Date.now() + OTP_TTL_MS,
    attempts: 0,
    sentAt: Date.now(),
  } satisfies OtpFile);

  const sent = await deliverSms(phone, code);
  if (!sent.ok) {
    await removeObject(`otp/${phone}.json`);
    return { ok: false as const, error: sent.error };
  }
  return { ok: true as const };
}

async function deliverSms(phone: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const local = `0${phone.slice(2)}`;
  const text = `کد ورود فدک: ${code}\nاین کد تا ۵ دقیقه معتبر است.`;
  const kavenegar = process.env.KAVENEGAR_API_KEY;
  if (kavenegar) {
    const sender = process.env.KAVENEGAR_SENDER || "";
    const body = new URLSearchParams({ receptor: local, message: text });
    if (sender) body.set("sender", sender);
    const res = await fetch(`https://api.kavenegar.com/v1/${kavenegar}/sms/send.json`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return { ok: false, error: "ارسال پیامک انجام نشد. کمی بعد دوباره تلاش کنید." };
    return { ok: true };
  }
  const smsIr = process.env.SMSIR_API_KEY;
  if (smsIr) {
    const res = await fetch("https://api.sms.ir/v1/send/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": smsIr },
      body: JSON.stringify({
        mobile: local,
        templateId: Number(process.env.SMSIR_TEMPLATE_ID || 0),
        parameters: [{ name: "Code", value: code }],
      }),
    });
    if (!res.ok) return { ok: false, error: "ارسال پیامک انجام نشد. کمی بعد دوباره تلاش کنید." };
    return { ok: true };
  }
  return { ok: false, error: "ارسال کد تایید هنوز به پنل پیامک وصل نشده است." };
}

async function createAuthUser(phone: string) {
  const res = await fetch(`${projectUrl()}/auth/v1/admin/users`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `${phone}@users.fadak.invalid`,
      email_confirm: true,
      user_metadata: { phone, display_name: "" },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const user = await res.json();
  return user.id as string;
}

export async function verifyLoginCode(rawPhone: string, code: string) {
  const phone = normalizeIranMobile(rawPhone);
  if (!phone) return { ok: false as const, error: "شماره موبایل معتبر نیست." };
  const otp = await readJson<OtpFile>(`otp/${phone}.json`);
  if (!otp || otp.expires < Date.now()) return { ok: false as const, error: "کد منقضی شده. دوباره درخواست کنید." };
  if (otp.attempts >= 5) return { ok: false as const, error: "تلاش‌های این کد تمام شد. کد جدید بگیرید." };
  if (otp.hash !== otpHash(phone, code.trim())) {
    await writeJson(`otp/${phone}.json`, { ...otp, attempts: otp.attempts + 1 });
    return { ok: false as const, error: "کد تایید اشتباه است." };
  }
  await removeObject(`otp/${phone}.json`);

  let userId = (await readJson<{ userId: string }>(`phones/${phone}.json`))?.userId;
  if (!userId) {
    userId = await createAuthUser(phone);
    await writeJson(`phones/${phone}.json`, { userId });
    await writeJson(`profiles/${userId}.json`, {
      id: userId,
      phone,
      name: "",
      city: "",
      version: 1,
      likes: [],
      saves: [],
    } satisfies Profile);
  }
  const token = randomBytes(32).toString("hex");
  await writeJson(`sessions/${sha(token)}.json`, { userId, expires: Date.now() + SESSION_TTL_MS } satisfies SessionFile);
  const profile = await readJson<Profile>(`profiles/${userId}.json`);
  return { ok: true as const, token, needsName: !profile?.name };
}

export async function userFromToken(token: string | undefined) {
  if (!token || !accountsConfigured()) return null;
  const session = await readJson<SessionFile>(`sessions/${sha(token)}.json`);
  if (!session || session.expires < Date.now()) return null;
  const profile = await readJson<Profile>(`profiles/${session.userId}.json`);
  if (!profile) return null;
  return { id: profile.id, phone: profile.phone, name: profile.name, city: profile.city } satisfies AccountUser;
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await removeObject(`sessions/${sha(token)}.json`);
}

export async function updateProfile(userId: string, input: { name?: string; city?: string }) {
  const profile = await readJson<Profile>(`profiles/${userId}.json`);
  if (!profile) return null;
  const next: Profile = {
    ...profile,
    name: (input.name ?? profile.name).trim().slice(0, 80),
    city: (input.city ?? profile.city).trim().slice(0, 40),
    version: profile.version + 1,
  };
  await writeJson(`profiles/${userId}.json`, next);
  return { id: next.id, phone: next.phone, name: next.name, city: next.city } satisfies AccountUser;
}

async function mutateProfile(userId: string, change: (profile: Profile) => Profile) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const current = await readJson<Profile>(`profiles/${userId}.json`);
    if (!current) return null;
    const next = change({ ...current, likes: [...current.likes], saves: [...current.saves] });
    next.version = current.version + 1;
    await writeJson(`profiles/${userId}.json`, next);
    const check = await readJson<Profile>(`profiles/${userId}.json`);
    if (check?.version === next.version) return next;
  }
  return null;
}

async function adjustCount(key: string, delta: number) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const current = (await readJson<CountsFile>("counts.json")) || { version: 0, items: {} };
    const next: CountsFile = {
      version: current.version + 1,
      items: { ...current.items, [key]: Math.max(0, (current.items[key] || 0) + delta) },
    };
    await writeJson("counts.json", next);
    const check = await readJson<CountsFile>("counts.json");
    if (check?.version === next.version) return next.items[key] || 0;
  }
  return 0;
}

export async function engagementFor(userId: string | null, keys: string[]) {
  const counts = (await readJson<CountsFile>("counts.json"))?.items || {};
  const profile = userId ? await readJson<Profile>(`profiles/${userId}.json`) : null;
  const mine: Record<string, { liked: boolean; saved: boolean }> = {};
  for (const key of keys) {
    mine[key] = {
      liked: Boolean(profile?.likes.includes(key)),
      saved: Boolean(profile?.saves.some((item) => item.key === key)),
    };
  }
  const picked: Record<string, number> = {};
  for (const key of keys) picked[key] = counts[key] || 0;
  return { counts: picked, mine };
}

export async function toggleEngagement(
  userId: string,
  type: "video" | "audio" | "reel",
  id: string,
  action: "like" | "save",
  meta: { title: string; href: string; thumb?: string },
) {
  const key = itemKey(type, id);
  let delta = 0;
  const profile = await mutateProfile(userId, (current) => {
    if (action === "like") {
      if (current.likes.includes(key)) {
        current.likes = current.likes.filter((item) => item !== key);
        delta = -1;
      } else {
        current.likes.push(key);
        delta = 1;
      }
    } else if (current.saves.some((item) => item.key === key)) {
      current.saves = current.saves.filter((item) => item.key !== key);
    } else {
      current.saves.push({ key, title: meta.title || "بدون عنوان", href: meta.href || "/", thumb: meta.thumb });
    }
    return current;
  });
  if (!profile) return null;
  const count = delta === 0 ? ((await readJson<CountsFile>("counts.json"))?.items[key] || 0) : await adjustCount(key, delta);
  return {
    count,
    liked: profile.likes.includes(key),
    saved: profile.saves.some((item) => item.key === key),
  };
}

export async function favoritesOf(userId: string) {
  const profile = await readJson<Profile>(`profiles/${userId}.json`);
  return profile?.saves || [];
}

export async function listAccounts() {
  const res = await fetch(`${projectUrl()}/auth/v1/admin/users?page=1&per_page=200`, { headers: authHeaders(), cache: "no-store" });
  if (!res.ok) return [];
  const body = await res.json();
  const users = (body.users || []) as { id: string; created_at?: string; user_metadata?: { phone?: string; display_name?: string } }[];
  const rows = [];
  for (const user of users) {
    const profile = await readJson<Profile>(`profiles/${user.id}.json`);
    if (!profile && !user.user_metadata?.phone) continue;
    rows.push({
      id: user.id,
      phone: profile?.phone || user.user_metadata?.phone || "",
      name: profile?.name || user.user_metadata?.display_name || "",
      city: profile?.city || "",
      likes: profile?.likes.length || 0,
      saves: profile?.saves.length || 0,
      createdAt: user.created_at || "",
    });
  }
  return rows;
}

export function adminPasswordOk(username: string | undefined, password: string | undefined) {
  if (username !== "yasin" || !password) return false;
  const expected = Buffer.from("7a3e6e22ce88a71d828e2772049b725fa5e1db1ca870332feeba953001441299", "hex");
  const actual = scryptSync(password, "fadak-admin-salt-v1", 32);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
