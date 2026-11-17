import Link from "next/link";

type Props = {
  href: string;
  title: string;
  dateLabel: string;
  coverUrl?: string | null;
  className?: string;
};

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

/** قالب کارت مراسم: عکس کاور، عنوان، خط طلایی، نشان فدک و تاریخ خود مراسم. */
export default function CeremonyCard({ href, title, dateLabel, coverUrl, className = "" }: Props) {
  return (
    <Link href={href} className={`group block ${className}`}>
      <div className="overflow-hidden rounded-2xl border-2 border-[#c9a227] bg-[#111] shadow-[0_10px_28px_rgba(0,0,0,0.28)]">
        <div className="relative aspect-[3/4] overflow-hidden">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0b3d2e]">
              <img src="/brand/heyat-mark.png" alt="" className="h-24 w-auto opacity-90" />
            </div>
          )}
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-center text-sm font-bold leading-6 text-white">{title}</h3>
      <div className="mx-auto mt-2 h-0.5 w-14 rounded-full bg-[#c9a227]" />
      <div className="mt-3 flex items-center justify-between gap-2">
        <img src="/brand/fadak-mark.png" alt="" className="h-8 w-8 shrink-0" />
        {dateLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/80">
            <CalendarIcon />
            {dateLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
