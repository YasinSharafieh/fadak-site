import type { ReactNode } from "react";
import ThemeImage from "@/components/ThemeImage";
import CenteredScroller from "@/components/CenteredScroller";

export const metadata = { title: "رسانه حسین طاهری | فدک" };

type Row = { name: string; line: string; href: string; color: string; icon: ReactNode };

function Mark({ src }: { src: string }) {
  return <img src={src} alt="" width={22} height={22} className="media-logo" />;
}

function Site() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0e7c7b" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" />
    </svg>
  );
}

const ig = <Mark src="/brand/platforms/instagram.png" />;
const tg = <Mark src="/brand/platforms/telegram.png" />;
const yt = <Mark src="/brand/platforms/youtube.png" />;
const ap = <Mark src="/brand/platforms/aparat.png" />;
const ei = <Mark src="/brand/platforms/eitaa.png" />;
const ru = <Mark src="/brand/platforms/rubika.png" />;
const bl = <Mark src="/brand/platforms/bale.png" />;
const so = <Mark src="/brand/platforms/soroush.png" />;
const sp = <Mark src="/brand/platforms/spotify.png" />;
const sc = <Mark src="/brand/platforms/soundcloud.png" />;
const am = <Mark src="/brand/platforms/apple.png" />;
const th = <Mark src="/brand/platforms/threads.png" />;
const tt = <Mark src="/brand/platforms/tiktok.png" />;
const xx = <Mark src="/brand/platforms/x.png" />;

const meydan: Row[] = [
  { name: "بله", line: "کانال میدان", href: "https://ble.ir/enqhelab_sq", color: "#2BB673", icon: bl },
  { name: "ایتا", line: "کانال میدان", href: "https://eitaa.com/enqhelab_sq", color: "#FF6A00", icon: ei },
  { name: "تلگرام", line: "کانال میدان", href: "https://t.me/enqhelab_sq", color: "#2AABEE", icon: tg },
  { name: "اینستاگرام", line: "صفحه میدان", href: "https://www.instagram.com/enqhelab_sq/", color: "#E4405F", icon: ig },
  { name: "روبیکا", line: "کانال میدان", href: "https://rubika.ir/enqhelab_sq", color: "#7C4DFF", icon: ru },
];

const fadak: Row[] = [
  { name: "تلگرام", line: "کانال فدک", href: "https://t.me/fadakinfo_channel", color: "#2AABEE", icon: tg },
  { name: "اینستاگرام", line: "صفحه فدک", href: "https://www.instagram.com/fadakinfo/", color: "#E4405F", icon: ig },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/fadakinfo", color: "#ED145B", icon: ap },
  { name: "ایتا", line: "کانال فدک", href: "https://eitaa.com/fadakinfo_chanel", color: "#FF6A00", icon: ei },
  { name: "روبیکا", line: "صفحه فدک", href: "https://rubika.ir/fadakinfo", color: "#7C4DFF", icon: ru },
  { name: "بله", line: "کانال فدک", href: "https://ble.ir/fadakinfo_channel", color: "#2BB673", icon: bl },
  { name: "پخش زنده", line: "اینستاگرام", href: "https://www.instagram.com/fadak_live/", color: "#E4405F", icon: ig },
];

const taheri: Row[] = [
  { name: "تلگرام", line: "کانال شخصی", href: "https://t.me/hoseintaheri_telegram", color: "#2AABEE", icon: tg },
  { name: "اینستاگرام", line: "صفحه شخصی", href: "https://www.instagram.com/hoseintaheri_official/", color: "#E4405F", icon: ig },
  { name: "یوتیوب", line: "کانال تصویری", href: "https://www.youtube.com/@hoseintaheri", color: "#FF0033", icon: yt },
  { name: "تیک‌تاک", line: "طاهری‌نت", href: "https://www.tiktok.com/@taheri_net", color: "#69C9D0", icon: tt },
  { name: "ایکس", line: "حساب رسمی", href: "https://x.com/hoseintaheri213", color: "#F2F2F2", icon: xx },
  { name: "عربیک", line: "صفحه عربی", href: "https://www.instagram.com/taheri_arabic/", color: "#E4405F", icon: ig },
  { name: "روضه", line: "اینستاگرام", href: "https://www.instagram.com/taheri_rozhe/", color: "#E4405F", icon: ig },
  { name: "اسپاتیفای", line: "آثار صوتی", href: "https://open.spotify.com/artist/3Il4BH4byO5Nx3qDlADGWm", color: "#1DB954", icon: sp },
  { name: "ساندکلاد", line: "آثار صوتی", href: "https://soundcloud.com/hosseintaheri-music", color: "#FF5500", icon: sc },
  { name: "اپل موزیک", line: "آثار صوتی", href: "https://music.apple.com/us/artist/hossein-taheri/1008212856", color: "#FA243C", icon: am },
  { name: "تردز", line: "صفحه شخصی", href: "https://www.threads.com/@hoseintaheri", color: "#111111", icon: th },
  { name: "دو خط شعر", line: "کانال شعر", href: "https://t.me/taheri_sher", color: "#C9A227", icon: tg },
  { name: "ادمین", line: "ارتباط", href: "https://t.me/Taheri_Admin", color: "#2AABEE", icon: tg },
];

const noorieh: Row[] = [
  { name: "سایت", line: "پایگاه نوریه", href: "https://noorieh.ir/", color: "#0e7c7b", icon: <Site /> },
  { name: "یوتیوب", line: "حاج محمدرضا", href: "https://www.youtube.com/@hajmohammadrezataheri", color: "#FF0033", icon: yt },
  { name: "تلگرام", line: "کانال نوریه", href: "https://t.me/nooriehinfo", color: "#2AABEE", icon: tg },
  { name: "اینستاگرام", line: "صفحه نوریه", href: "https://www.instagram.com/nooriehinfo/", color: "#E4405F", icon: ig },
  { name: "آرشیو", line: "اینستاگرام", href: "https://www.instagram.com/noorieh_archive/", color: "#E4405F", icon: ig },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/nooriehinfo", color: "#ED145B", icon: ap },
  { name: "ایتا", line: "کانال نوریه", href: "https://eitaa.com/noorieh_ir", color: "#FF6A00", icon: ei },
  { name: "روبیکا", line: "کانال نوریه", href: "https://rubika.ir/nooriehinfo", color: "#7C4DFF", icon: ru },
  { name: "بله", line: "کانال نوریه", href: "https://ble.ir/noorieh_ir", color: "#2BB673", icon: bl },
  { name: "سروش", line: "کانال رسمی", href: "https://splus.ir/noorieh_ir", color: "#1E4BD2", icon: so },
];

const alireza: Row[] = [
  { name: "تلگرام", line: "کانال شخصی", href: "https://t.me/alirezataheri_telegram", color: "#2AABEE", icon: tg },
  { name: "ایتا", line: "کانال رسمی", href: "https://eitaa.com/karbalaialirezataheri", color: "#FF6A00", icon: ei },
  { name: "آپارات", line: "نماهنگ‌ها", href: "https://www.aparat.com/playlist/22828737/", color: "#ED145B", icon: ap },
];

function Rows({ items }: { items: Row[] }) {
  return (
    <div className="mt-3 flex flex-col gap-1">
      {items.map((item) => (
        <a
          key={item.href + item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`${item.name} — ${item.line}`}
          className="media-row"
          style={{ ["--mark" as string]: item.color }}
        >
          <span className="media-seal"><span className="media-glyph">{item.icon}</span></span>
          <span className="min-w-0 text-right">
            <span className="media-name block text-[13px] font-extrabold">{item.name}</span>
            <span className="media-line block text-[10px]">{item.line}</span>
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
  caption,
  large,
}: {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  caption: string;
  large?: boolean;
}) {
  return (
    <div className="media-head">
      <span className={large ? "media-medallion" : "media-crest"}>
        <ThemeImage
          darkSrc={darkSrc}
          lightSrc={lightSrc}
          alt={alt}
          className={large ? "h-20 w-20 object-contain sm:h-24 sm:w-24" : "h-14 w-14 object-contain sm:h-16 sm:w-16"}
        />
      </span>
      <p className="media-caption">{caption}</p>
    </div>
  );
}

export default function AboutTaheriPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark pointer-events-none absolute inset-0 opacity-30" />
      <div className="media-glow pointer-events-none absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full" />
      <div className="relative mx-auto max-w-7xl px-3 py-10 sm:px-4">
        <CenteredScroller>
          <div className="media-board">
            <section className="media-col">
              <Crest darkSrc="/brand/meydan-mark.png" lightSrc="/brand/meydan-mark-ink.png" alt="میدان انقلاب" caption="اجتماع به عشق وطن" />
              <Rows items={meydan} />
            </section>
            <section className="media-col">
              <div className="media-head">
                <span className="media-word">
                  <ThemeImage darkSrc="/brand/fadak-wordmark.png" lightSrc="/brand/fadak-wordmark-ink.png" alt="فدک" className="h-9 w-auto max-w-[7.5rem] object-contain sm:h-10" />
                </span>
                <p className="media-caption">فدک</p>
              </div>
              <Rows items={fadak} />
            </section>
            <section className="media-col media-col-center" data-center="">
              <Crest darkSrc="/brand/taheri-mark.png" lightSrc="/brand/taheri-mark-ink.png" alt="حسین طاهری" caption="حسین طاهری" large />
              <Rows items={taheri} />
            </section>
            <section className="media-col">
              <div className="media-head">
                <span className="media-word">
                  <ThemeImage darkSrc="/brand/noorieh-logo.png" lightSrc="/brand/noorieh-logo-ink.png" alt="نوریه" className="h-9 w-auto max-w-[7.5rem] object-contain sm:h-10" />
                </span>
                <p className="media-caption">نوریه</p>
              </div>
              <Rows items={noorieh} />
            </section>
            <section className="media-col">
              <Crest darkSrc="/brand/alireza-mark.png" lightSrc="/brand/alireza-mark-ink.png" alt="علیرضا طاهری" caption="علیرضا طاهری" />
              <Rows items={alireza} />
            </section>
          </div>
        </CenteredScroller>
        <p className="mt-8 text-center text-sm">
          <a href="https://zil.ink/taheri_net" target="_blank" rel="noopener noreferrer" className="media-zil">
            zil.ink/taheri_net
          </a>
        </p>
      </div>
      <style>{`
        .media-glow { background: radial-gradient(circle, rgba(201,162,39,.18), transparent 68%); }
        .media-wrap {
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: thin;
        }
        .media-board {
          display: grid;
          grid-template-columns: repeat(5, minmax(10.4rem, 1fr));
          gap: .55rem;
          align-items: start;
          width: max(100%, 56rem);
        }
        @media (min-width: 1180px) {
          .media-board { width: 100%; gap: .75rem; }
        }
        .media-col {
          border: 1px solid rgba(201,162,39,.28);
          border-radius: 1.25rem;
          background:
            linear-gradient(180deg, rgba(255,255,255,.05), transparent 18%),
            #141210;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 14px 30px rgba(0,0,0,.24);
          padding: .75rem .45rem .9rem;
        }
        .media-col-center {
          border-color: rgba(201,162,39,.55);
          box-shadow:
            inset 0 1px 0 rgba(255,236,180,.2),
            0 18px 40px rgba(0,0,0,.36),
            0 0 0 1px rgba(201,162,39,.15);
        }
        .media-head { display: flex; min-height: 6.4rem; flex-direction: column; align-items: center; justify-content: flex-end; }
        .media-col-center .media-head { min-height: 7.6rem; }
        .media-medallion, .media-crest, .media-word {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .media-medallion, .media-crest {
          border-radius: 999px;
          background: radial-gradient(circle at 50% 42%, rgba(201,162,39,.16), transparent 62%);
          box-shadow: inset 0 0 0 1px rgba(201,162,39,.45), 0 8px 18px rgba(0,0,0,.28);
        }
        .media-medallion { padding: .28rem; }
        .media-crest { padding: .22rem; }
        .media-word { height: 3.4rem; }
        .media-caption {
          margin-top: .45rem;
          text-align: center;
          font-size: .78rem;
          font-weight: 800;
          line-height: 1.45;
          color: rgba(255,255,255,.92);
        }
        .media-row {
          display: flex;
          align-items: center;
          gap: .45rem;
          border-radius: .85rem;
          padding: .22rem .15rem;
          text-decoration: none;
          color: inherit;
        }
        .media-row:focus-visible { outline: none; }
        .media-seal {
          display: flex;
          height: 2.15rem;
          width: 2.15rem;
          flex: none;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 28%, rgba(255,255,255,.22), rgba(255,255,255,.05) 36%, rgba(0,0,0,.28) 72%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.35),
            inset 0 -6px 8px rgba(0,0,0,.4),
            0 5px 8px rgba(0,0,0,.24);
          transition: transform .22s ease, box-shadow .22s ease;
        }
        .media-glyph { display: flex; align-items: center; justify-content: center; }
        .media-logo { width: 18px; height: 18px; object-fit: contain; }
        .media-name { color: rgba(255,255,255,.92); }
        .media-line { color: rgba(255,255,255,.42); transition: color .22s ease; }
        .media-row:hover .media-seal,
        .media-row:focus-visible .media-seal {
          transform: translateY(-2px) scale(1.06);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.45),
            inset 0 -5px 8px rgba(0,0,0,.3),
            0 8px 14px rgba(0,0,0,.28),
            0 0 0 1px var(--mark),
            0 0 14px color-mix(in srgb, var(--mark) 55%, transparent);
        }
        .media-row:hover .media-line,
        .media-row:focus-visible .media-line { color: var(--mark); }
        .media-zil { color: #c9a227; font-weight: 700; text-decoration: none; }
        .media-zil:hover { text-decoration: underline; }
        html[data-theme="light"] .media-col {
          background: linear-gradient(180deg, rgba(255,255,255,.8), #fffdf9 30%);
          box-shadow: inset 0 1px 0 #fff, 0 12px 24px rgba(70,52,20,.08);
        }
        html[data-theme="light"] .media-name,
        html[data-theme="light"] .media-caption { color: #1c1915; }
        html[data-theme="light"] .media-line { color: rgba(28,25,21,.5); }
        html[data-theme="light"] .media-seal {
          background: radial-gradient(circle at 32% 28%, #fff, #f3ead8 42%, #e4d7bf 78%);
          box-shadow: inset 0 1px 0 #fff, inset 0 -5px 7px rgba(90,60,20,.16), 0 5px 8px rgba(70,50,20,.12);
        }
      `}</style>
    </div>
  );
}
