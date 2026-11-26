import ShareButton from "@/components/ShareButton";

export const metadata = { title: "پخش زنده | فدک" };
export const instant = false;

const LIVE_EMBED = "https://www.aparat.com/fadakinfo/live?embed&fa";
const LIVE_PAGE = "https://www.aparat.com/fadakinfo/live";

export default function LivePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white">پخش زنده</h1>
        <p className="mt-2 text-sm text-white/70">مراسم هیئت فدائیان حضرت زهرا (س) از آپارات فدک</p>
      </div>

      <div className="gold-frame mt-6 overflow-hidden rounded-3xl bg-black shadow-2xl">
        <iframe
          src={LIVE_EMBED}
          title="پخش زنده فدک"
          className="aspect-video w-full bg-black"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#1a1a1a] p-6">
        <p className="max-w-xl text-sm leading-7 text-white/70">
          وقتی مراسم زنده باشد، همین‌جا پخش می‌شود. در زمان‌های دیگر، تصویر آمادهٔ آپارات دیده می‌شود.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={LIVE_PAGE} target="_blank" rel="noopener noreferrer" className="btn-green rounded-full px-5 py-2 text-sm">
            آپارات فدک
          </a>
          <ShareButton title="پخش زنده فدک" path="/live" />
        </div>
      </div>
    </div>
  );
}
