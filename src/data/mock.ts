export type EventItem = {
  id: string;
  title: string;
  dateFa: string;
  dateHijri: string;
  maddah: string;
  speaker?: string;
  location: string;
  address: string;
  mapUrl: string;
  poster?: string;
};

export const fadakAddress = "تهران، میدان هفتم تیر، خیابان مفتح جنوبی، خیابان ورزنده (جنب ورزشگاه شهید شیرودی)، خیابان ملک الشعراء بهار، حسینیه سیدالشهدا (ع)";
// نقطهٔ دقیق پین گوگل‌مپ هیئت: https://maps.app.goo.gl/VH1DNAbp3PgNZ9zK8
export const fadakLat = 35.7089559;
export const fadakLon = 51.4273495;
export const fadakMapPlace = "https://maps.app.goo.gl/VH1DNAbp3PgNZ9zK8";
export const fadakMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${fadakLat},${fadakLon}`;
export const fadakMapEmbed = `https://maps.google.com/maps?q=${fadakLat},${fadakLon}&hl=fa&z=17&output=embed`;

export const upcomingEvents: EventItem[] = [
  {
    id: "next-1",
    title: "مجلس روضه هفتگی",
    dateFa: "هر سه‌شنبه — ساعت ۱۹:۳۰",
    dateHijri: "",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    address: fadakAddress,
    mapUrl: fadakMapUrl,
  },
];

export const pastEvents: EventItem[] = [
  {
    id: "past-1",
    title: "مجلس‌روضه هفتگی‌",
    dateFa: "۱۴ مهر ۱۴۰۵",
    dateHijri: "۲۴ ربیع‌الثانی ۱۴۴۸",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    address: fadakAddress,
    mapUrl: fadakMapUrl,
  },
  {
    id: "past-2",
    title: "مجلس‌روضه هفتگی‌",
    dateFa: "۷ مهر ۱۴۰۵",
    dateHijri: "۱۷ ربیع‌الثانی ۱۴۴۸",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    address: fadakAddress,
    mapUrl: fadakMapUrl,
  },
  {
    id: "past-3",
    title: "روز شهادت حضرت جوادالائمه(ع)",
    dateFa: "۲۷ اردیبهشت ۱۴۰۵",
    dateHijri: "۲۹ ذی‌القعده ۱۴۴۷",
    maddah: "کربلایی حسین طاهری",
    location: "حسینیه سیدالشهدا (ع)",
    address: fadakAddress,
    mapUrl: fadakMapUrl,
  },
];

export const hadithOfDay = {
  text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
  translation: "همانا اعمال به نیت‌ها بستگی دارد.",
  source: "صحیح بخاری و مسلم",
};

export const reels = [
  { id: "1", title: "شور | یوحنا", duration: "03:51" },
  { id: "2", title: "مناجات با امام زمان", duration: "07:26" },
  { id: "3", title: "زمینه | قرارمونو بهم نزن", duration: "02:18" },
  { id: "4", title: "شور | جهان مانوس اباالفضل", duration: "04:56" },
  { id: "5", title: "شور | میگن اسمت غمه حسین", duration: "04:39" },
];

export const socialLinks = [
  { name: "اینستاگرام فدک", url: "https://instagram.com/fadakinfo", icon: "📸" },
  { name: "تلگرام فدک", url: "https://t.me/fadakinfo_channel", icon: "✈️" },
  { name: "آپارات فدک", url: "https://www.aparat.com/fadakinfo", icon: "🎬" },
  { name: "روبیکا فدک", url: "https://rubika.ir/fadakinfo", icon: "🔴" },
  { name: "یوتیوب حسین طاهری", url: "https://youtube.com/@hoseintaheri", icon: "▶️" },
  { name: "تلگرام حسین طاهری", url: "https://t.me/hoseintaheri_telegram", icon: "✈️" },
  { name: "نوریه", url: "https://noorieh.ir/", icon: "🕌" },
  { name: "قرار بی‌قرارها", url: "https://gharaar.net/", icon: "🚐" },
];

export const collections = [
  { name: "فاطمیه", slug: "fatimieh" },
  { name: "محرم", slug: "moharam" },
  { name: "صفر", slug: "safar" },
  { name: "رمضان", slug: "ramadan" },
  { name: "برنامه هفتگی", slug: "weekly" },
  { name: "مناسبت‌های مذهبی", slug: "occasions" },
];
