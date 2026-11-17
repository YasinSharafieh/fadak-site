import type { ReactNode } from "react";
import ThemeImage from "@/components/ThemeImage";

export const metadata = { title: "رسانه حسین طاهری | فدک" };

type Row = { name: string; line: string; href: string; color: string; icon: ReactNode };

const svg = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };

function Telegram() {
  return <svg {...svg}><path d="M21.6 4.2 2.9 11.1c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.1-.3 4.7c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.4c.3-1.3-.5-1.9-1.4-1.5Z" /></svg>;
}
function Instagram() {
  return (
    <svg {...svg} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YouTube() {
  return <svg {...svg}><path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6 3.3-6 3.3Z" /></svg>;
}
function Aparat() {
  return <svg {...svg}><path d="M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm5.2 3.3v8.4l7-4.2-7-4.2Z" /></svg>;
}
function Eitaa() {
  return <svg {...svg}><path d="M12 2.4c5 0 8.6 3.5 8.6 8.1 0 4.7-3.8 8.2-8.6 8.2-1 0-2-.2-2.9-.5L4.2 20.6l1.5-3.4A8 8 0 0 1 3.4 10.5C3.4 5.9 7 2.4 12 2.4Zm-1.2 5.2v7.2h1.7v-2.6h1.5c1.8 0 2.9-1.1 2.9-2.4 0-1.3-1.1-2.2-2.9-2.2H10.8Zm1.7 1.4h1.2c.8 0 1.3.4 1.3 1.1s-.5 1.1-1.3 1.1h-1.2V9Z" /></svg>;
}
function Rubika() {
  return <svg {...svg}><path d="M12 2.2 14.8 8l6.2.6-4.7 4.1 1.4 6.1L12 15.8 6.3 18.8l1.4-6.1L3 8.6 9.2 8 12 2.2Z" /></svg>;
}
function Bale() {
  return <svg {...svg}><path d="M4 5.5h10.2a4.3 4.3 0 0 1 0 8.6H8.2L4.4 17.2V5.5Zm2 2v6.1l1.6-1.3h6.6a2.3 2.3 0 0 0 0-4.6H6Z" /></svg>;
}
function Spotify() {
  return <svg {...svg}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.7.7 0 0 1-1 .2c-2.6-1.6-5.9-2-9.8-1.1a.7.7 0 0 1-.3-1.4c4.2-1 7.9-.5 10.8 1.2.4.2.5.7.3 1.1Zm1.3-2.9a.9.9 0 0 1-1.2.3c-3-1.8-7.5-2.4-11-.1a.9.9 0 1 1-.5-1.7c4-1 9.1-.5 12.5 1.4.4.3.5.8.2 1.1Zm.1-3a1 1 0 0 1-1.4.3C13.4 8.6 8 8.4 4.7 9.4a1 1 0 1 1-.6-1.9c3.8-1.2 9.8-1 13.5.9.5.3.6.9.4 1.4Z" /></svg>;
}
function SoundCloud() {
  return <svg {...svg}><path d="M8.2 16.8V9.4h1.2v7.4H8.2Zm-2.2 0v-5.2h1.2v5.2H6Zm-2.1 0v-3.4h1.1v3.4H3.9Zm13.8-.1a3.3 3.3 0 0 0 .1-6.6 4.6 4.6 0 0 0-8.8-1.3 3.2 3.2 0 0 0-1.5 6.1v1.8h10.2Z" /></svg>;
}
function Apple() {
  return <svg {...svg}><path d="M16.4 12.7c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.7c-1.5.1-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.2-3.6Zm-2-6.6c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.7 1.1.1 2.1-.5 2.7-1.4Z" /></svg>;
}
function Threads() {
  return (
    <svg {...svg} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.2 11.2c.7-2.6 2.4-4 4.4-4 2.6 0 4.2 1.8 4.2 4.4 0 4.4-3.4 7.2-7.6 7.2-4.4 0-7.4-3.2-7.4-7.4S6 4.2 10.6 4.2c1.5 0 2.8.3 3.9.9" strokeLinecap="round" />
      <path d="M15.8 11.6c-.2 2.4-1.6 4-3.6 4-1.6 0-2.7-1.1-2.7-2.6 0-1.4 1-2.4 2.5-2.4 1.8 0 3.1 1.2 3.8 3.2" strokeLinecap="round" />
    </svg>
  );
}
function Site() {
  return <svg {...svg} fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" /></svg>;
}

const fadak: Row[] = [
  { name: "تلگرام", line: "کانال فدک", href: "https://t.me/fadakinfo_channel", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه فدک", href: "https://www.instagram.com/fadakinfo/", color: "#E4405F", icon: <Instagram /> },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/fadakinfo", color: "#ED145B", icon: <Aparat /> },
  { name: "ایتا", line: "کانال فدک", href: "https://eitaa.com/fadakinfo_chanel", color: "#FF6A00", icon: <Eitaa /> },
  { name: "روبیکا", line: "صفحه فدک", href: "https://rubika.ir/fadakinfo", color: "#7C4DFF", icon: <Rubika /> },
  { name: "بله", line: "کانال فدک", href: "https://ble.ir/fadakinfo_channel", color: "#1E88E5", icon: <Bale /> },
  { name: "پخش زنده", line: "اینستاگرام", href: "https://www.instagram.com/fadak_live/", color: "#E4405F", icon: <Instagram /> },
];

const taheri: Row[] = [
  { name: "تلگرام", line: "کانال شخصی", href: "https://t.me/hoseintaheri_telegram", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه شخصی", href: "https://www.instagram.com/hoseintaheri/", color: "#E4405F", icon: <Instagram /> },
  { name: "یوتیوب", line: "کانال تصویری", href: "https://www.youtube.com/@hoseintaheri", color: "#FF0033", icon: <YouTube /> },
  { name: "اسپاتیفای", line: "آثار صوتی", href: "https://open.spotify.com/artist/3Il4BH4byO5Nx3qDlADGWm", color: "#1DB954", icon: <Spotify /> },
  { name: "ساندکلاد", line: "آثار صوتی", href: "https://soundcloud.com/hosseintaheri-music", color: "#FF5500", icon: <SoundCloud /> },
  { name: "اپل موزیک", line: "آثار صوتی", href: "https://music.apple.com/us/artist/hossein-taheri/1008212856", color: "#FA243C", icon: <Apple /> },
  { name: "تردز", line: "صفحه شخصی", href: "https://www.threads.com/@hoseintaheri", color: "#F2F2F2", icon: <Threads /> },
  { name: "دو خط شعر", line: "کانال شعر", href: "https://t.me/taheri_sher", color: "#C9A227", icon: <Telegram /> },
];

const noorieh: Row[] = [
  { name: "سایت", line: "پایگاه نوریه", href: "https://noorieh.ir/", color: "#C9A227", icon: <Site /> },
  { name: "تلگرام", line: "کانال نوریه", href: "https://t.me/nooriehinfo", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه نوریه", href: "https://www.instagram.com/nooriehinfo/", color: "#E4405F", icon: <Instagram /> },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/nooriehinfo", color: "#ED145B", icon: <Aparat /> },
  { name: "بله", line: "کانال نوریه", href: "https://ble.ir/nooriehir", color: "#1E88E5", icon: <Bale /> },
];

function Rows({ items }: { items: Row[] }) {
  return (
    <div className="mt-5 flex flex-col gap-1.5">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.name}
          className="media-row"
          style={{ ["--mark" as string]: item.color }}
        >
          <span className="media-seal"><span className="media-glyph">{item.icon}</span></span>
          <span className="min-w-0 text-right">
            <span className="media-name block text-sm font-extrabold">{item.name}</span>
            <span className="media-line block text-[11px]">{item.line}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export default function AboutTaheriPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark pointer-events-none absolute inset-0 opacity-30" />
      <div className="media-glow pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="media-board">
          <section className="media-col">
            <div className="flex h-28 items-center justify-center">
              <ThemeImage darkSrc="/brand/fadak-wordmark.png" lightSrc="/brand/fadak-wordmark-ink.png" alt="فدک" className="h-12 w-auto max-w-[11rem] object-contain sm:h-14" />
            </div>
            <Rows items={fadak} />
          </section>

          <section className="media-col media-col-center">
            <div className="flex h-36 items-center justify-center">
              <span className="media-medallion">
                <ThemeImage darkSrc="/brand/taheri-mark.png" lightSrc="/brand/taheri-mark-ink.png" alt="حسین طاهری" className="h-28 w-28 object-contain sm:h-32 sm:w-32" />
              </span>
            </div>
            <Rows items={taheri} />
          </section>

          <section className="media-col">
            <div className="flex h-28 items-center justify-center">
              <ThemeImage darkSrc="/brand/noorieh-logo.png" lightSrc="/brand/noorieh-logo-ink.png" alt="نوریه" className="h-12 w-auto max-w-[11rem] object-contain sm:h-14" />
            </div>
            <Rows items={noorieh} />
          </section>
        </div>
      </div>
      <style>{`
        .media-glow { background: radial-gradient(circle, rgba(201,162,39,.18), transparent 68%); }
        .media-board {
          display: grid;
          grid-template-columns: 1fr 1.08fr 1fr;
          gap: .55rem;
          align-items: start;
        }
        @media (min-width: 900px) {
          .media-board { gap: 1rem; }
        }
        @media (max-width: 640px) {
          .media-col { padding: .55rem .35rem .7rem; border-radius: 1.1rem; }
          .media-seal { height: 2.15rem; width: 2.15rem; }
          .media-name { font-size: 11px; }
          .media-line { font-size: 9px; }
          .media-row { gap: .4rem; padding: .2rem; }
        }
        .media-col {
          border: 1px solid rgba(201,162,39,.28);
          border-radius: 1.6rem;
          background:
            linear-gradient(180deg, rgba(255,255,255,.05), transparent 18%),
            #141210;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 18px 40px rgba(0,0,0,.28);
          padding: 1.1rem 1rem 1.2rem;
        }
        .media-col-center {
          transform: translateY(-6px);
          border-color: rgba(201,162,39,.55);
          box-shadow:
            inset 0 1px 0 rgba(255,236,180,.2),
            0 22px 50px rgba(0,0,0,.4),
            0 0 0 1px rgba(201,162,39,.15);
        }
        .media-medallion {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: .35rem;
          background: radial-gradient(circle at 50% 42%, rgba(201,162,39,.16), transparent 62%);
          box-shadow: inset 0 0 0 1px rgba(201,162,39,.45), 0 10px 28px rgba(0,0,0,.35);
        }
        .media-row {
          display: flex;
          align-items: center;
          gap: .75rem;
          border-radius: 1rem;
          padding: .35rem .4rem;
          text-decoration: none;
          color: inherit;
        }
        .media-row:focus-visible { outline: none; }
        .media-seal {
          display: flex;
          height: 2.7rem;
          width: 2.7rem;
          flex: none;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #c9a227;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,.2), rgba(255,255,255,.04) 36%, rgba(0,0,0,.35) 72%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.35),
            inset 0 -7px 10px rgba(0,0,0,.45),
            0 6px 10px rgba(0,0,0,.28);
          transition: transform .22s ease, box-shadow .22s ease, color .22s ease;
        }
        .media-glyph { display: flex; }
        .media-name { color: rgba(255,255,255,.92); }
        .media-line { color: rgba(255,255,255,.42); transition: color .22s ease; }
        .media-row:hover .media-seal,
        .media-row:focus-visible .media-seal {
          color: var(--mark);
          transform: translateY(-3px) scale(1.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.45),
            inset 0 -6px 10px rgba(0,0,0,.35),
            0 10px 16px rgba(0,0,0,.32),
            0 0 0 1px var(--mark),
            0 0 18px color-mix(in srgb, var(--mark) 55%, transparent);
        }
        .media-row:hover .media-line,
        .media-row:focus-visible .media-line { color: var(--mark); }
        html[data-theme="light"] .media-col {
          background: linear-gradient(180deg, rgba(255,255,255,.8), #fffdf9 30%);
          box-shadow: inset 0 1px 0 #fff, 0 14px 30px rgba(70,52,20,.08);
        }
        html[data-theme="light"] .media-name { color: #1c1915; }
        html[data-theme="light"] .media-line { color: rgba(28,25,21,.5); }
        html[data-theme="light"] .media-seal {
          background: radial-gradient(circle at 32% 28%, #fff, #f3ead8 42%, #e4d7bf 78%);
          box-shadow: inset 0 1px 0 #fff, inset 0 -6px 8px rgba(90,60,20,.16), 0 6px 10px rgba(70,50,20,.12);
        }
      `}</style>
    </div>
  );
}
