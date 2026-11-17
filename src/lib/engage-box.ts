export const BOX_COOKIE = "fadak_box";

export type SavedItem = { key: string; title: string; href: string; thumb?: string };
export type EngageBox = { likes: string[]; saves: SavedItem[] };

export function emptyBox(): EngageBox {
  return { likes: [], saves: [] };
}

export function decodeBox(raw: string | undefined): EngageBox {
  if (!raw) return emptyBox();
  try {
    const data = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as Partial<EngageBox>;
    const likes = Array.isArray(data.likes) ? data.likes.filter((key): key is string => typeof key === "string").slice(-120) : [];
    const saves = Array.isArray(data.saves)
      ? data.saves
          .filter((item): item is SavedItem => Boolean(item) && typeof item.key === "string" && typeof item.href === "string")
          .slice(-36)
      : [];
    return { likes, saves };
  } catch {
    return emptyBox();
  }
}

export function encodeBox(box: EngageBox) {
  return Buffer.from(JSON.stringify({ likes: box.likes.slice(-120), saves: box.saves.slice(-36) })).toString("base64url");
}

export function toggleBox(box: EngageBox, key: string, action: "like" | "save", meta: SavedItem) {
  const next: EngageBox = { likes: [...box.likes], saves: [...box.saves] };
  if (action === "like") {
    next.likes = next.likes.includes(key) ? next.likes.filter((item) => item !== key) : [...next.likes, key];
  } else if (next.saves.some((item) => item.key === key)) {
    next.saves = next.saves.filter((item) => item.key !== key);
  } else {
    next.saves.push({ key, title: meta.title, href: meta.href, thumb: meta.thumb });
  }
  return next;
}
