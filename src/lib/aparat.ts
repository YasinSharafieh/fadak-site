export type AparatVideoInfo = {
  thumbnail: string | null;
  fileUrl: string | null;
  duration: string | null;
};

export async function getAparatVideoInfo(aparatId: string): Promise<AparatVideoInfo> {
  try {
    const res = await fetch(`https://www.aparat.com/api/fa/v1/video/video/show/VID/${aparatId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { thumbnail: null, fileUrl: null, duration: null };
    const json = await res.json();
    const d = json?.data || {};
    const fileUrl = d.file_link_720p || d.file_link_480p || d.file_link || null;
    const duration = d.duration ? `${Math.floor(d.duration / 60)}:${String(d.duration % 60).padStart(2, "0")}` : null;
    return { thumbnail: d.thumbnail || null, fileUrl, duration };
  } catch {
    return { thumbnail: null, fileUrl: null, duration: null };
  }
}

export async function refreshVideoThumbnails<T extends { aparat_id: string; thumbnail?: string; duration?: string }>(videos: T[]): Promise<T[]> {
  return Promise.all(
    videos.map(async (v) => {
      if (!v.aparat_id) return v;
      const info = await getAparatVideoInfo(v.aparat_id);
      return { ...v, thumbnail: info.thumbnail || v.thumbnail, duration: info.duration || v.duration };
    })
  );
}

export async function getAparatFileUrl(aparatId: string): Promise<string | null> {
  const info = await getAparatVideoInfo(aparatId);
  return info.fileUrl;
}
