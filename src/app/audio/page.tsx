import AudioPlayer from "@/components/AudioPlayer";

const tracks = [
  { title: "روضه هفتگی — ۱۴ مهر ۱۴۰۵ — بخش ۱", src: "https://www.soundhelix.com/examples/soundhelix-song-1.mp3" },
  { title: "روضه هفتگی — ۱۴ مهر ۱۴۰۵ — بخش ۲", src: "https://www.soundhelix.com/examples/soundhelix-song-2.mp3" },
  { title: "شهادت حضرت جوادالائمه (ع) — ۱۴۰۵", src: "https://www.soundhelix.com/examples/soundhelix-song-3.mp3" },
];

export default function AudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-[#0B3D2E]">صوت</h1>
      <p className="mt-2 text-[#3D2B1F]/80">پخش آنلاین صوت‌های مراسم با دانلود و پلی‌لیست</p>
      <div className="mt-8 space-y-4">
        {tracks.map((t) => (
          <AudioPlayer key={t.title} title={t.title} src={t.src} />
        ))}
      </div>
      <p className="mt-6 rounded-2xl bg-[#F7F3E8] p-4 text-sm">فایل‌های صوتی واقعی پس از اتصال Supabase Storage جایگزین می‌شوند.</p>
    </div>
  );
}
