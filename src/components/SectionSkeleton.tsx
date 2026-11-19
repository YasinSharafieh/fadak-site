type Kind = "video-row" | "ceremony-row" | "video-grid" | "audio" | "photos" | "poems" | "events" | "archive" | "search" | "account" | "reel";

const label: Record<Kind, string> = {
  "video-row": "نماهنگ‌ها",
  "ceremony-row": "مراسم‌ها",
  "video-grid": "نماهنگ‌ها",
  audio: "صوت‌ها",
  photos: "عکس‌ها",
  poems: "اشعار",
  events: "مراسم‌ها",
  archive: "آرشیو",
  search: "نتایج",
  account: "حساب",
  reel: "ریلز",
};

function Bone({ className }: { className: string }) {
  return <div className={`fadak-shimmer ${className}`} />;
}

function Mark() {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[#c9a227]">
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#14a3a2]/30" />
        <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-[#c9a227]/30 border-t-[#14a3a2]" />
      </span>
      در حال آماده‌سازی
    </span>
  );
}

export default function SectionSkeleton({ kind }: { kind: Kind }) {
  return (
    <div role="status" aria-live="polite" aria-label={`در حال بارگذاری ${label[kind]}`} className="keep-contrast col-span-full">
      {kind === "video-row" && (
        <div className="flex gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-64 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a]">
              <Bone className="aspect-video" />
              <div className="space-y-2 p-3">
                <Bone className="h-4 w-4/5 rounded" />
                <Bone className="h-3 w-1/2 rounded" />
                <Mark />
              </div>
            </div>
          ))}
        </div>
      )}
      {kind === "ceremony-row" && (
        <div className="flex gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-[210px] shrink-0 overflow-hidden rounded-2xl border border-[#c9a227]/20 bg-[#1a1a1a] sm:w-[230px]">
              <Bone className="aspect-[3/4]" />
              <div className="space-y-2 p-3">
                <Bone className="h-4 w-3/4 rounded" />
                <Bone className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
      {kind === "video-grid" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a]">
              <Bone className="aspect-video" />
              <div className="space-y-2 p-4">
                <Bone className="h-4 w-4/5 rounded" />
                <Bone className="h-3 w-1/3 rounded" />
                {i === 0 && <Mark />}
              </div>
            </div>
          ))}
        </div>
      )}
      {kind === "audio" && (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl bg-[#1a1a1a] p-4">
              <Bone className="h-12 w-12 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bone className="h-4 w-2/3 rounded" />
                <Bone className="h-1.5 w-full rounded-full" />
              </div>
              {i === 0 && <Mark />}
            </div>
          ))}
        </div>
      )}
      {kind === "photos" && (
        <div className="col-span-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Bone key={i} className="aspect-square rounded-2xl" />
          ))}
          <div className="col-span-full flex justify-center pt-2"><Mark /></div>
        </div>
      )}
      {kind === "poems" && (
        <div className="col-span-full grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-[#c9a227]/20 bg-[#1a1a1a] p-6">
              <Bone className="h-5 w-1/2 rounded" />
              <Bone className="h-3 w-full rounded" />
              <Bone className="h-3 w-5/6 rounded" />
              <Bone className="h-3 w-2/3 rounded" />
            </div>
          ))}
        </div>
      )}
      {kind === "events" && (
        <div className="col-span-full grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-[#c9a227]/30 bg-[#1a1a1a] p-6">
              <Bone className="h-6 w-2/3 rounded" />
              <Bone className="h-4 w-1/2 rounded" />
              <Bone className="h-16 w-full rounded-xl" />
              {i === 0 && <Mark />}
            </div>
          ))}
        </div>
      )}
      {kind === "archive" && (
        <div className="col-span-full grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Bone className="aspect-[3/4] rounded-2xl" />
              <Bone className="h-4 w-4/5 rounded" />
              <Bone className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}
      {kind === "search" && (
        <div className="space-y-3">
          <Mark />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-[#1a1a1a] p-4">
              <Bone className="h-10 w-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bone className="h-4 w-1/2 rounded" />
                <Bone className="h-3 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
      {kind === "account" && (
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-2">
              <Bone className="h-3 w-20 rounded" />
              <Bone className="h-8 w-48 rounded" />
            </div>
            <Bone className="h-9 w-20 rounded-full" />
          </div>
          <div className="mt-8 space-y-4 rounded-3xl border border-[#c9a227]/30 bg-[#111] p-6">
            <Bone className="h-5 w-28 rounded" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Bone className="h-16 rounded-2xl" />
              <Bone className="h-16 rounded-2xl" />
            </div>
            <Mark />
          </div>
          <div className="mt-8 space-y-3">
            <Bone className="h-5 w-32 rounded" />
            <Bone className="h-16 rounded-2xl" />
            <Bone className="h-16 rounded-2xl" />
          </div>
        </div>
      )}
      {kind === "reel" && (
        <div className="flex h-full w-full items-center justify-center bg-black">
          <div className="relative h-[78vh] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#111]">
            <Bone className="absolute inset-0" />
            <div className="absolute bottom-8 right-6 left-6 space-y-3">
              <Bone className="h-4 w-1/2 rounded" />
              <Bone className="h-3 w-2/3 rounded" />
              <Mark />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
