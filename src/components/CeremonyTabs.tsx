"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";

type Props = {
  photos: { id: string; url: string; caption?: string }[];
  audios: { id: string; title: string; file_url: string }[];
  videos: { id: string; title: string; aparat_id: string; thumbnail?: string; duration?: string }[];
};

export default function CeremonyTabs({ photos, audios, videos }: Props) {
  const [tab, setTab] = useState<"photos" | "audios" | "videos">("photos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const tabs = [
    { id: "photos" as const, label: `📷 عکس‌ها (${photos.length})` },
    { id: "audios" as const, label: `🎵 صوت‌ها (${audios.length})` },
    { id: "videos" as const, label: `🎬 ویدیوها (${videos.length})` },
  ];

  return (
    <div className="mt-10">
      <div className="flex gap-2 border-b border-[#C9A227]/30 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === t.id
                ? "bg-[#0B3D2E] text-[#F7F3E8]"
                : "bg-white text-[#3D2B1F] hover:bg-[#F7F3E8]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "photos" && (
          <div>
            {photos.length === 0 && <p className="text-sm text-[#3D2B1F]/60">هنوز عکسی ثبت نشده.</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((p) => (
                <figure key={p.id}>
                  <img src={p.url} alt={p.caption || ""} className="aspect-square w-full rounded-2xl object-cover" />
                  {p.caption && <figcaption className="mt-1 text-center text-xs text-[#3D2B1F]/70">{p.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        )}

        {tab === "audios" && (
          <div className="space-y-3">
            {audios.length === 0 && <p className="text-sm text-[#3D2B1F]/60">هنوز صوتی ثبت نشده.</p>}
            {audios.map((a) => (
              <AudioPlayer key={a.id} title={a.title} src={a.file_url} />
            ))}
          </div>
        )}

        {tab === "videos" && (
          <div>
            {videos.length === 0 && <p className="text-sm text-[#3D2B1F]/60">هنوز ویدیویی ثبت نشده.</p>}
            <div className="grid gap-5 md:grid-cols-2">
              {videos.map((v) => (
                <div key={v.id} className="overflow-hidden rounded-3xl bg-white shadow">
                  <div className="relative aspect-video w-full bg-black">
                    {playingId === v.id && v.aparat_id ? (
                      <iframe
                        src={`https://www.aparat.com/video/${v.aparat_id}/vframe/embed`}
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                        title={v.title}
                      />
                    ) : (
                      <button onClick={() => setPlayingId(v.id)} className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B]">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A227] text-4xl text-white shadow-lg">▶</span>
                        {v.duration && <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>}
                      </button>
                    )}
                  </div>
                  <div className="p-4 text-center font-bold">{v.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
