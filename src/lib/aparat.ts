export async function getAparatThumbnail(aparatId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.aparat.com/api/fa/v1/video/video/show/VID/${aparatId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.thumbnail || null;
  } catch {
    return null;
  }
}

export async function refreshVideoThumbnails<T extends { aparat_id: string; thumbnail?: string }>(videos: T[]): Promise<T[]> {
  return Promise.all(
    videos.map(async (v) => {
      const fresh = await getAparatThumbnail(v.aparat_id);
      return { ...v, thumbnail: fresh || v.thumbnail };
    })
  );
}
