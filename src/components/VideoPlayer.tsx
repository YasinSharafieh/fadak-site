"use client";

import { useState } from "react";

type Props = {
  aparatId: string;
  title: string;
  thumbnail?: string;
};

/**
 * پلیر ویدیوی آپارات با مدیریت خطای graceful:
 * اگر ویدیو روی آپارات حذف/خصوصی شده باشد، به‌جای صفحه خالی،
 * پیام مناسب + دکمه مشاهده در آپارات نمایش داده می‌شود.
 */
export default function VideoPlayer({ aparatId, title, thumbnail }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const embedUrl = `https://www.aparat.com/video/video/embed/videohash/${aparatId}/vt/frame`;
  const watchUrl = `https://www.aparat.com/v/${aparatId}`;

  // اگر بعد از ۱۲ ثانیه لود نشد، احتمالاً ویدیو خراب است
  const handleTimeout = () => {
    if (!loaded) setFailed(true);
  };

  if (failed) {
    return (
      <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] p-6 text-center">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
        )}
        <div className="relative">
          <div className="text-5xl">🎬</div>
          <p className="mt-3 font-bold text-white">این ویدیو در حال حاضر در آپارات در دسترس نیست</p>
          <p className="mt-1 text-sm text-white/70">ممکن است حذف یا خصوصی شده باشد.</p>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green mt-4 inline-block rounded-full px-6 py-2 text-sm"
          >
            مشاهده در آپارات
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a]">
          {thumbnail && <img src={thumbnail} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-40" />}
          <div className="relative h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#0e7c7b]" />
          <p className="relative text-sm text-white/60">در حال بارگذاری ویدیو...</p>
        </div>
      )}
      <iframe
        src={embedUrl}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="absolute inset-0 h-full w-full"
        title={title}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        onAnimationEnd={handleTimeout}
      />
    </div>
  );
}
