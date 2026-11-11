export type EventItem = {
  id: string;
  title: string;
  dateFa: string;
  dateHijri: string;
  speaker: string;
  maddah: string;
  location: string;
  poster?: string;
  status: "upcoming" | "past";
};

export const upcomingEvents: EventItem[] = [
  {
    id: "roze-haftagi",
    title: "مجلس روضه هفتگی",
    dateFa: "سه‌شنبه ۲۱ آبان ۱۴۰۵ — ساعت ۱۹:۳۰",
    dateHijri: "۲۱ جمادی‌الثانی ۱۴۴۸",
    speaker: "—",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)، تهران",
    status: "upcoming",
  },
  {
    id: "veladat-aliakbar",
    title: "جشن ولادت حضرت علی‌اکبر (ع)",
    dateFa: "جمعه ۱۰ بهمن ۱۴۰۴ — ساعت ۲۰:۰۰",
    dateHijri: "۱۱ شعبان ۱۴۴۷",
    speaker: "حجت‌الاسلام ...",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)، تهران",
    status: "upcoming",
  },
];

export const pastEvents: EventItem[] = [
  {
    id: "14-mehr",
    title: "مجلس روضه هفتگی — ۱۴ مهر ۱۴۰۵",
    dateFa: "۱۴ مهر ۱۴۰۵",
    dateHijri: "۱۴ ربیع‌الثانی ۱۴۴۸",
    speaker: "—",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    status: "past",
  },
  {
    id: "7-mehr",
    title: "مجلس روضه هفتگی — ۷ مهر ۱۴۰۵",
    dateFa: "۷ مهر ۱۴۰۵",
    dateHijri: "۷ ربیع‌الثانی ۱۴۴۸",
    speaker: "—",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    status: "past",
  },
  {
    id: "javadolaeme",
    title: "روز شهادت حضرت جوادالائمه (ع)",
    dateFa: "۲۷ اردیبهشت ۱۴۰۵",
    dateHijri: "۲۹ ذی‌القعده ۱۴۴۷",
    speaker: "—",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    status: "past",
  },
];

export const hadithOfDay = {
  text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
  translation: "همانا اعمال به نیت‌ها بستگی دارد.",
  source: "پیامبر اکرم (ص) — بحارالانوار",
};

export const reels = [
  { id: "r1", title: "عاقبت توقع بی‌جا", duration: "۰:۴۵" },
  { id: "r2", title: "معجزه یاد مرگ", duration: "۱:۱۰" },
  { id: "r3", title: "الگوی ناب بندگی", duration: "۰:۵۸" },
  { id: "r4", title: "پناهگاه حق", duration: "۱:۰۲" },
];

export const socialLinks = [
  { name: "اینستاگرام", href: "https://instagram.com", desc: "ریلز و عکس‌های مراسم" },
  { name: "تلگرام", href: "https://t.me", desc: "کانال اطلاع‌رسانی و صوت" },
  { name: "ایتا", href: "https://eitaa.com", desc: "کانال ایتا" },
  { name: "بله", href: "https://ble.ir", desc: "کانال بله" },
  { name: "روبیکا", href: "https://rubika.ir", desc: "کانال روبیکا" },
  { name: "آپارات", href: "https://aparat.com", desc: "نماهنگ‌ها و ویدیوها" },
];
