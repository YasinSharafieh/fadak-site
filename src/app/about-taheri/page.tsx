import type { ReactNode } from "react";

export const metadata = {
  title: "رسانه حسین طاهری | فدک",
};

type Mark = {
  name: string;
  href: string;
  color: string;
  icon: ReactNode;
};

const svg = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
};

function Telegram() {
  return (
    <svg {...svg}>
      <path d="M21.6 4.2 2.9 11.1c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.1-.3 4.7c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.4c.3-1.3-.5-1.9-1.4-1.5Z" />
    </svg>
  );
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
  return (
    <svg {...svg}>
      <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5V8.9l6 3.3-6 3.3Z" />
    </svg>
  );
}

function Aparat() {
  return (
    <svg {...svg}>
      <path d="M4 4.5h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm5.2 3.3v8.4l7-4.2-7-4.2Z" />
    </svg>
  );
}

function Eitaa() {
  return (
    <svg {...svg}>
      <path d="M12 2.4c5 0 8.6 3.5 8.6 8.1 0 4.7-3.8 8.2-8.6 8.2-1 0-2-.2-2.9-.5L4.2 20.6l1.5-3.4A8 8 0 0 1 3.4 10.5C3.4 5.9 7 2.4 12 2.4Zm-1.2 5.2v7.2h1.7v-2.6h1.5c1.8 0 2.9-1.1 2.9-2.4 0-1.3-1.1-2.2-2.9-2.2H10.8Zm1.7 1.4h1.2c.8 0 1.3.4 1.3 1.1s-.5 1.1-1.3 1.1h-1.2V9Z" />
    </svg>
  );
}

function Rubika() {
  return (
    <svg {...svg}>
      <path d="M12 2.2 14.8 8l6.2.6-4.7 4.1 1.4 6.1L12 15.8 6.3 18.8l1.4-6.1L3 8.6 9.2 8 12 2.2Z" />
    </svg>
  );
}

function Bale() {
  return (
    <svg {...svg}>
      <path d="M4 5.5h10.2a4.3 4.3 0 0 1 0 8.6H8.2L4.4 17.2V5.5Zm2 2v6.1l1.6-1.3h6.6a2.3 2.3 0 0 0 0-4.6H6Z" />
    </svg>
  );
}

function Spotify() {
  return (
    <svg {...svg}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.7.7 0 0 1-1 .2c-2.6-1.6-5.9-2-9.8-1.1a.7.7 0 0 1-.3-1.4c4.2-1 7.9-.5 10.8 1.2.4.2.5.7.3 1.1Zm1.3-2.9a.9.9 0 0 1-1.2.3c-3-1.8-7.5-2.4-11-.1a.9.9 0 1 1-.5-1.7c4-1 9.1-.5 12.5 1.4.4.3.5.8.2 1.1Zm.1-3a1 1 0 0 1-1.4.3C13.4 8.6 8 8.4 4.7 9.4a1 1 0 1 1-.6-1.9c3.8-1.2 9.8-1 13.5.9.5.3.6.9.4 1.4Z" />
    </svg>
  );
}

function SoundCloud() {
  return (
    <svg {...svg}>
      <path d="M8.2 16.8V9.4h1.2v7.4H8.2Zm-2.2 0v-5.2h1.2v5.2H6Zm-2.1 0v-3.4h1.1v3.4H3.9Zm13.8-.1a3.3 3.3 0 0 0 .1-6.6 4.6 4.6 0 0 0-8.8-1.3 3.2 3.2 0 0 0-1.5 6.1v1.8h10.2Z" />
    </svg>
  );
}

function Apple() {
  return (
    <svg {...svg}>
      <path d="M16.4 12.7c0-2.2 1.8-3.2 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.6.8-3.3.8s-1.7-.8-2.8-.7c-1.5.1-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7 1.9-1.1 2.6-2.2c.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.8-2.2-3.6Zm-2-6.6c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.7 1.1.1 2.1-.5 2.7-1.4Z" />
    </svg>
  );
}

function Threads() {
  return (
    <svg {...svg} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9.2 11.2c.7-2.6 2.4-4 4.4-4 2.6 0 4.2 1.8 4.2 4.4 0 4.4-3.4 7.2-7.6 7.2-4.4 0-7.4-3.2-7.4-7.4S6 4.2 10.6 4.2c1.5 0 2.8.3 3.9.9" strokeLinecap="round" />
      <path d="M15.8 11.6c-.2 2.4-1.6 4-3.6 4-1.6 0-2.7-1.1-2.7-2.6 0-1.4 1-2.4 2.5-2.4 1.8 0 3.1 1.2 3.8 3.2" strokeLinecap="round" />
    </svg>
  );
}

const personal: Mark[] = [
  { name: "تلگرام", href: "https://t.me/hoseintaheri_telegram", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", href: "https://www.instagram.com/hoseintaheri/", color: "#E4405F", icon: <Instagram /> },
  { name: "یوتیوب", href: "https://www.youtube.com/@hoseintaheri", color: "#FF0033", icon: <YouTube /> },
  { name: "اسپاتیفای", href: "https://open.spotify.com/artist/3Il4BH4byO5Nx3qDlADGWm", color: "#1DB954", icon: <Spotify /> },
  { name: "ساندکلاد", href: "https://soundcloud.com/hosseintaheri-music", color: "#FF5500", icon: <SoundCloud /> },
  { name: "اپل موزیک", href: "https://music.apple.com/us/artist/hossein-taheri/1008212856", color: "#FA243C", icon: <Apple /> },
  { name: "تردز", href: "https://www.threads.com/@hoseintaheri", color: "#F4F4F4", icon: <Threads /> },
  { name: "دو خط شعر", href: "https://t.me/taheri_sher", color: "#2AABEE", icon: <Telegram /> },
];

const heyat: Mark[] = [
  { name: "تلگرام", href: "https://t.me/fadakinfo_channel", color: "#2AABEE", icon: <Telegram /> },
  { name: "اینستاگرام", href: "https://www.instagram.com/fadakinfo/", color: "#E4405F", icon: <Instagram /> },
  { name: "آپارات", href: "https://www.aparat.com/fadakinfo", color: "#ED145B", icon: <Aparat /> },
  { name: "ایتا", href: "https://eitaa.com/fadakinfo_chanel", color: "#FF6A00", icon: <Eitaa /> },
  { name: "روبیکا", href: "https://rubika.ir/fadakinfo", color: "#7C4DFF", icon: <Rubika /> },
  { name: "بله", href: "https://ble.ir/fadakinfo_channel", color: "#1E88E5", icon: <Bale /> },
  { name: "پخش زنده", href: "https://www.instagram.com/fadak_live/", color: "#E4405F", icon: <Instagram /> },
];

function Desk({ title, note, items }: { title: string; note: string; items: Mark[] }) {
  return (
    <section className="gold-frame rounded-3xl bg-[#1a1a1a] p-5 sm:p-7">
      <h2 className="text-lg font-extrabold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/55">{note}</p>
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.name + item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="desk-link flex flex-col items-center gap-2 rounded-2xl px-2 py-3"
            style={{ ["--mark" as string]: item.color }}
          >
            <span className="desk-ring flex h-16 w-16 items-center justify-center rounded-2xl border bg-black/25">
              <span className="desk-mark">{item.icon}</span>
            </span>
            <span className="desk-name text-center text-xs font-bold">{item.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function AboutTaheriPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="islamic-pattern-dark pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-5xl px-4 py-14">
        <header className="mx-auto max-w-xl text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-[#c9a227]">رسانه</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">حسین طاهری</h1>
          <p className="mt-3 text-sm leading-7 text-white/60">صفحه‌های شخصی و صفحه‌های هیئت، جدا از هم.</p>
        </header>

        <div className="mt-10 grid gap-6">
          <Desk title="صفحات حسین طاهری" note="صفحه شخصی." items={personal} />
          <Desk title="صفحات هیئت فدک" note="مال هیئت است؛ وابسته به آثار او، نه صفحه شخصی." items={heyat} />
        </div>

        <p className="mt-8 text-center text-sm text-white/50">
          <a href="https://zil.ink/taheri_net" target="_blank" rel="noopener noreferrer" className="text-[#c9a227] hover:underline">
            فهرست کامل
          </a>
        </p>
      </div>
      <style>{`
        .desk-link { color: inherit; text-decoration: none; }
        .desk-link:focus-visible { outline: none; }
        .desk-mark { color: #c9a227; display: flex; transition: color .2s ease, transform .2s ease, filter .2s ease; }
        .desk-name { color: rgba(255,255,255,.62); transition: color .2s ease; }
        .desk-ring { border-color: rgba(201,162,39,.38); transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; }
        .desk-link:hover .desk-mark,
        .desk-link:focus-visible .desk-mark {
          color: var(--mark);
          transform: scale(1.12);
          filter: drop-shadow(0 0 10px var(--mark));
        }
        .desk-link:hover .desk-name,
        .desk-link:focus-visible .desk-name { color: var(--mark); }
        .desk-link:hover .desk-ring,
        .desk-link:focus-visible .desk-ring {
          border-color: var(--mark);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--mark) 24%, transparent);
          background: color-mix(in srgb, var(--mark) 14%, transparent);
        }
        html[data-theme="light"] .desk-name { color: rgba(28,25,21,.62); }
        html[data-theme="light"] .desk-ring { background: rgba(255,255,255,.72); }
      `}</style>
    </div>
  );
}
