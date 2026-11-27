import ShareButton from "@/components/ShareButton";

export const metadata = { title: "پخش زنده | فدک" };
export const instant = false;

const LIVE_EMBED = "https://www.aparat.com/embed/live/fadakinfo/vt/frame";
const LIVE_PAGE = "https://www.aparat.com/fadakinfo/live";

export default function LivePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <div data-motion="fade" className="text-center">
        <h1 className="text-3xl font-extrabold text-white">پخش زنده</h1>
        <p className="mt-2 text-sm text-white/70">مراسم هیئت فدائیان حضرت زهرا (س) از آپارات فدک</p>
      </div>

      <div className="gold-frame mt-6 overflow-hidden rounded-3xl bg-black shadow-2xl">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={LIVE_EMBED}
            title="پخش زنده فدک"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <a href={LIVE_PAGE} target="_blank" rel="noopener noreferrer" className="btn-green rounded-full px-5 py-2 text-sm">
          آپارات فدک
        </a>
        <ShareButton title="پخش زنده فدک" path="/live" />
      </div>
    </div>
  );
}
