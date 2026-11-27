"use client";

import { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import EngageBar from "./EngageBar";

type Props = {
  photos: { id: string; url: string; caption?: string }[];
  audios: { id: string; title: string; file_url: string }[];
  videos: { id: string; title: string; aparat_id: string; thumbnail?: string; duration?: string }[];
  ceremonyHref?: string;
};

function fileVideoUrl(aparatId: string) {
  if (!aparatId.startsWith("file-")) return "";
  const id = aparatId.slice("file-".length);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${base}/storage/v1/object/public/videos/ceremony/${id}.mp4`;
}

export default function CeremonyTabs({ photos, audios, videos, ceremonyHref = "/audio" }: Props) {
  const [tab, setTab] = useState<"photos" | "audios" | "videos">("photos");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const tabs = [
    { id: "photos" as const, label: `📷 عکس‌ها (${photos.length})` },
    { id: "audios" as const, label: `🎵 صوت‌ها (${audios.length})` },
    { id: "videos" as const, label: `🎬 ویدیوها (${videos.length})` },
  ];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2 border-b border-[#0e7c7b]/30 pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-2 text-xs font-bold transition sm:px-5 sm:text-sm ${
              tab === t.id
                ? "bg-[#0b3d2e] text-[#F7F3E8]"
                : "bg-[#1a1a1a] text-white/70 hover:bg-[#111111]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "photos" && (
          <div>
            {photos.length === 0 && <p className="text-sm text-white/70/60">هنوز عکسی ثبت نشده.</p>}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {photos.map((p) => (
                <img key={p.id} src={p.url} alt="" className="aspect-square w-full rounded-2xl object-cover" />
              ))}
            </div>
          </div>
        )}

        {tab === "audios" && (
          <div className="space-y-3">
            {audios.length === 0 && <p className="text-sm text-white/70/60">هنوز صوتی ثبت نشده.</p>}
            {audios.map((a) => (
              <AudioPlayer key={a.id} id={a.id} title={a.title} src={a.file_url} href={ceremonyHref} />
            ))}
          </div>
        )}

        {tab === "videos" && (
          <div>
            {videos.length === 0 && <p className="text-sm text-white/70/60">هنوز ویدیویی ثبت نشده.</p>}
            <div className="grid gap-5 md:grid-cols-2">
              {videos.map((v) => (
                <div key={v.id} className="overflow-hidden rounded-3xl bg-[#1a1a1a] shadow">
                  <div className="relative aspect-video w-full bg-black">
                    {playingId === v.id && v.aparat_id?.startsWith("file-") ? (
                      <video
                        src={fileVideoUrl(v.aparat_id)}
                        poster={v.thumbnail || undefined}
                        controls
                        playsInline
                        className="h-full w-full bg-black"
                      />
                    ) : playingId === v.id && v.aparat_id ? (
                      <VideoPlayer aparatId={v.aparat_id} title={v.title} thumbnail={v.thumbnail} videoId={v.id} />
                    ) : (
                      <button onClick={() => setPlayingId(v.id)} className="absolute inset-0 block w-full">
                        {v.thumbnail ? (
                          <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0E7C7B]" />
                        )}
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-3xl text-white">▶</span>
                        </span>
                        {v.duration && <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">{v.duration}</span>}
                      </button>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-bold">{v.title}</div>
                    <div className="mt-2 flex justify-center">
                      <EngageBar type="video" id={v.id} title={v.title} href={`/videos/${v.id}`} thumb={v.thumbnail} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
