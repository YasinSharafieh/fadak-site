import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const instant = false;

async function getVideo(id: string) {
  if (supabase) {
    const { data } = await supabase.from("videos").select("*").eq("id", id).single();
    if (data) return data;
  }
  return null;
}

async function getRelatedVideos(eventId: string, currentId: string) {
  if (supabase && eventId) {
    const { data } = await supabase.from("videos").select("*").eq("event_id", eventId).neq("id", currentId).limit(4);
    return data || [];
  }
  return [];
}

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = await getVideo(id);

  if (!video) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-white/60">ویدیویی یافت نشد.</p>
        <Link href="/videos" className="btn-green mt-4 inline-block rounded-full px-6 py-3">بازگشت به نماهنگ‌ها</Link>
      </div>
    );
  }

  const related = await getRelatedVideos(video.event_id, video.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <Link href="/videos" className="text-sm text-[#14a3a2] hover:underline">← بازگشت به نماهنگ‌ها</Link>

      {/* پلیر آپارات */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-black shadow-2xl">
        {video.aparat_id ? (
          <iframe
            src={`https://www.aparat.com/video/video/embed/videohash/${video.aparat_id}/vt/frame`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="aspect-video w-full"
            title={video.title}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-white/50">
            ویدیویی در دسترس نیست
          </div>
        )}
      </div>

      {/* اطلاعات ویدیو */}
      <div className="mt-6 rounded-3xl bg-[#1a1a1a] p-6 border border-white/10">
        <h1 className="text-2xl font-extrabold text-white">{video.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">
          <span>🎬 کربلایی حسین طاهری</span>
          {video.duration && <span>⏱️ {video.duration}</span>}
          <span>📺 آپارات</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`https://www.aparat.com/v/${video.aparat_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green rounded-full px-5 py-2 text-sm"
          >
            مشاهده در آپارات
          </a>
          <button className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/10 transition">
            📤 اشتراک‌گذاری
          </button>
        </div>
      </div>

      {/* ویدیوهای مرتبط */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-white">ویدیوهای مرتبط</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v: any) => (
              <Link key={v.id} href={`/videos/${v.id}`} className="card-hover group overflow-hidden rounded-2xl bg-[#1a1a1a] border border-white/5">
                <div className="relative aspect-video bg-black">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0b3d2e] to-[#0e7c7b] text-3xl text-white/20">🎬</div>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg text-white transition group-hover:bg-[#0e7c7b]">▶</span>
                  </span>
                  {v.duration && (
                    <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">{v.duration}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold leading-5">{v.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
