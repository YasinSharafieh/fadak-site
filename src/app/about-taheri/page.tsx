import type { ReactNode } from "react";
import ThemeImage from "@/components/ThemeImage";

export const metadata = { title: "رسانه حسین طاهری | فدک" };

type Row = { name: string; line: string; href: string; color: string; icon: ReactNode };

const svg = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true as const };

function Mark({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} width={22} height={22} className="media-logo" />;
}

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
function X() {
  return <svg {...svg}><path d="M14.23 10.16 22.98 0h-2.07l-7.59 8.82L7.25 0H.26l9.17 13.34L.26 24h2.07l8.02-9.32L16.75 24h6.99l-9.5-13.84Zm-2.84 3.3-.93-1.33L3.08 1.56h3.18l5.96 8.53.93 1.33 7.75 11.09h-3.18l-6.33-8.75Z" /></svg>;
}
function TikTok() {
  return <svg {...svg}><path d="M12.53.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" /></svg>;
}

const aparat = <Mark src="/brand/platforms/aparat.png" alt="" />;
const eitaa = <Mark src="/brand/platforms/eitaa.png" alt="" />;
const rubika = <Mark src="/brand/platforms/rubika.png" alt="" />;
const bale = <Mark src="/brand/platforms/bale.png" alt="" />;
const soroush = <Mark src="/brand/platforms/soroush.png" alt="" />;

const fadak: Row[] = [
  { name: "تلگرام", line: "کانال فدک", href: "https://t.me/fadakinfo_channel", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه فدک", href: "https://www.instagram.com/fadakinfo/", color: "#E4405F", icon: <Instagram /> },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/fadakinfo", color: "#ED145B", icon: aparat },
  { name: "ایتا", line: "کانال فدک", href: "https://eitaa.com/fadakinfo_chanel", color: "#FF6A00", icon: eitaa },
  { name: "روبیکا", line: "صفحه فدک", href: "https://rubika.ir/fadakinfo", color: "#7C4DFF", icon: rubika },
  { name: "بله", line: "کانال فدک", href: "https://ble.ir/fadakinfo_channel", color: "#2BB673", icon: bale },
  { name: "پخش زنده", line: "اینستاگرام", href: "https://www.instagram.com/fadak_live/", color: "#E4405F", icon: <Instagram /> },
];

const taheri: Row[] = [
  { name: "تلگرام", line: "کانال شخصی", href: "https://t.me/hoseintaheri_telegram", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه شخصی", href: "https://www.instagram.com/hoseintaheri_official/", color: "#E4405F", icon: <Instagram /> },
  { name: "یوتیوب", line: "کانال تصویری", href: "https://www.youtube.com/@hoseintaheri", color: "#FF0033", icon: <YouTube /> },
  { name: "تیک‌تاک", line: "طاهری‌نت", href: "https://www.tiktok.com/@hoseintaheri_net", color: "#69C9D0", icon: <TikTok /> },
  { name: "ایکس", line: "صفحه رسمی", href: "https://x.com/hoseintaheri_x", color: "#F2F2F2", icon: <X /> },
  { name: "عربیک", line: "صفحه عربی", href: "https://www.instagram.com/taheri_arabic/", color: "#E4405F", icon: <Instagram /> },
  { name: "اسپاتیفای", line: "آثار صوتی", href: "https://open.spotify.com/artist/3Il4BH4byO5Nx3qDlADGWm", color: "#1DB954", icon: <Spotify /> },
  { name: "ساندکلاد", line: "آثار صوتی", href: "https://soundcloud.com/hosseintaheri-music", color: "#FF5500", icon: <SoundCloud /> },
  { name: "اپل موزیک", line: "آثار صوتی", href: "https://music.apple.com/us/artist/hossein-taheri/1008212856", color: "#FA243C", icon: <Apple /> },
  { name: "تردز", line: "صفحه شخصی", href: "https://www.threads.com/@hoseintaheri", color: "#F2F2F2", icon: <Threads /> },
  { name: "دو خط شعر", line: "کانال شعر", href: "https://t.me/taheri_sher", color: "#C9A227", icon: <Telegram /> },
  { name: "ادمین", line: "ارتباط", href: "https://t.me/Taheri_Admin", color: "#2AABEE", icon: <Telegram /> },
];

const noorieh: Row[] = [
  { name: "سایت", line: "پایگاه نوریه", href: "https://noorieh.ir/", color: "#C9A227", icon: <Site /> },
  { name: "یوتیوب", line: "حاج محمدرضا", href: "https://www.youtube.com/@hajmohammadrezataheri", color: "#FF0033", icon: <YouTube /> },
  { name: "تلگرام", line: "کانال نوریه", href: "https://t.me/nooriehinfo", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", line: "صفحه نوریه", href: "https://www.instagram.com/nooriehinfo/", color: "#E4405F", icon: <Instagram /> },
  { name: "آرشیو", line: "اینستاگرام", href: "https://www.instagram.com/noorieh_archive/", color: "#E4405F", icon: <Instagram /> },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/nooriehinfo", color: "#ED145B", icon: aparat },
  { name: "ایتا", line: "کانال نوریه", href: "https://eitaa.com/noorieh_ir", color: "#FF6A00", icon: eitaa },
  { name: "روبیکا", line: "کانال نوریه", href: "https://rubika.ir/noorieh_ir", color: "#7C4DFF", icon: rubika },
  { name: "بله", line: "کانال نوریه", href: "https://ble.ir/noorieh_ir", color: "#2BB673", icon: bale },
  { name: "سروش", line: "کانال رسمی", href: "https://splus.ir/noorieh_ir", color: "#1E4BD2", icon: soroush },
];

const alireza: Row[] = [
  { name: "تلگرام", line: "کانال شخصی", href: "https://t.me/alirezataheri_telegram", color: "#2AABEE", icon: <Telegram /> },
  { name: "ایتا", line: "کانال رسمی", href: "https://eitaa.com/karbalaialirezataheri", color: "#FF6A00", icon: eitaa },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/playlist/22828737/", color: "#ED145B", icon: aparat },
];

function Rows({ items }: { items: Row[] }) {
  return (
    <div className="mt-4 flex flex-col gap-1.5">
      {items.map((item) => (
        <a
          key={item.href + item.name}
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

function Crest({
  darkSrc,
  lightSrc,
  alt,
  large,
}: {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  large?: boolean;
}) {
  return (
    <div className={large ? "flex h-36 items-center justify-center" : "flex h-24 items-center justify-center"}>
      <span className={large ? "media-medallion" : "media-crest"}>
        <ThemeImage
          darkSrc={darkSrc}
          lightSrc={lightSrc}
          alt={alt}
          className={large ? "h-28 w-28 object-contain sm:h-32 sm:w-32" : "h-16 w-16 object-contain sm:h-[4.5rem] sm:w-[4.5rem]"}
        />
      </span>
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
          <div className="media-side">
            <section className="media-col">
              <a href="https://zil.ink/taheri_net" target="_blank" rel="noopener noreferrer" className="media-crest-link" title="رسانه میدان انقلاب">
                <Crest darkSrc="/brand/meydan-mark.png" lightSrc="/brand/meydan-mark-ink.png" alt="میدان انقلاب" />
                <p className="media-caption">اجتماع به عشق وطن</p>
                <p className="media-note">بله، ایتا، تلگرام، اینستاگرام و روبیکا</p>
              </a>
            </section>
            <section className="media-col">
              <Crest darkSrc="/brand/alireza-mark.png" lightSrc="/brand/alireza-mark-ink.png" alt="علیرضا طاهری" />
              <Rows items={alireza} />
            </section>
          </div>

          <section className="media-col media-col-center">
            <Crest darkSrc="/brand/taheri-mark.png" lightSrc="/brand/taheri-mark-ink.png" alt="حسین طاهری" large />
            <Rows items={taheri} />
          </section>

          <div className="media-side">
            <section className="media-col">
              <div className="flex h-24 items-center justify-center">
                <ThemeImage darkSrc="/brand/fadak-wordmark.png" lightSrc="/brand/fadak-wordmark-ink.png" alt="فدک" className="h-11 w-auto max-w-[11rem] object-contain sm:h-12" />
              </div>
              <Rows items={fadak} />
            </section>
            <section className="media-col">
              <div className="flex h-24 items-center justify-center">
                <ThemeImage darkSrc="/brand/noorieh-logo.png" lightSrc="/brand/noorieh-logo-ink.png" alt="نوریه" className="h-11 w-auto max-w-[11rem] object-contain sm:h-12" />
              </div>
              <Rows items={noorieh} />
            </section>
          </div>
        </div>

        <p className="mt-8 text-center text-sm">
          <a href="https://zil.ink/taheri_net" target="_blank" rel="noopener noreferrer" className="media-zil">
            zil.ink/taheri_net
          </a>
        </p>
      </div>
      <style>{`
        .media-glow { background: radial-gradient(circle, rgba(201,162,39,.18), transparent 68%); }
        .media-board {
          display: grid;
          grid-template-columns: 1fr 1.08fr 1fr;
          gap: .7rem;
          align-items: start;
        }
        .media-side { display: flex; flex-direction: column; gap: .7rem; }
        @media (min-width: 900px) {
          .media-board { gap: 1rem; }
          .media-side { gap: 1rem; }
        }
        @media (max-width: 760px) {
          .media-board { grid-template-columns: 1fr; }
          .media-col-center { order: -1; }
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
        .media-medallion, .media-crest {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: radial-gradient(circle at 50% 42%, rgba(201,162,39,.16), transparent 62%);
          box-shadow: inset 0 0 0 1px rgba(201,162,39,.45), 0 10px 28px rgba(0,0,0,.35);
        }
        .media-medallion { padding: .35rem; }
        .media-crest { padding: .3rem; }
        .media-crest-link { display: block; text-decoration: none; color: inherit; }
        .media-crest-link:hover .media-crest { transform: translateY(-3px) scale(1.04); }
        .media-crest { transition: transform .22s ease; }
        .media-caption {
          margin-top: .85rem;
          text-align: center;
          font-size: .95rem;
          font-weight: 800;
          color: rgba(255,255,255,.92);
        }
        .media-note {
          margin: .45rem auto 0;
          max-width: 18rem;
          text-align: center;
          font-size: 11px;
          line-height: 1.8;
          color: rgba(255,255,255,.48);
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
        .media-glyph { display: flex; align-items: center; justify-content: center; }
        .media-logo { width: 22px; height: 22px; object-fit: contain; }
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
        .media-zil {
          color: #c9a227;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: .01em;
        }
        .media-zil:hover { text-decoration: underline; }
        html[data-theme="light"] .media-col {
          background: linear-gradient(180deg, rgba(255,255,255,.8), #fffdf9 30%);
          box-shadow: inset 0 1px 0 #fff, 0 14px 30px rgba(70,52,20,.08);
        }
        html[data-theme="light"] .media-name,
        html[data-theme="light"] .media-caption { color: #1c1915; }
        html[data-theme="light"] .media-line,
        html[data-theme="light"] .media-note { color: rgba(28,25,21,.5); }
        html[data-theme="light"] .media-seal {
          background: radial-gradient(circle at 32% 28%, #fff, #f3ead8 42%, #e4d7bf 78%);
          box-shadow: inset 0 1px 0 #fff, inset 0 -6px 8px rgba(90,60,20,.16), 0 6px 10px rgba(70,50,20,.12);
        }
      `}</style>
    </div>
  );
}
