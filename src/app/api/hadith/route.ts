import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const hadithBank = [
  {
    text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    translation: "همانا اعمال به نیت‌ها بستگی دارد.",
    source: "صحیح بخاری و مسلم",
  },
  {
    text: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْعِلْمَ وَعَلَّمَهُ",
    translation: "بهترین شما کسی است که علم را بیاموزد و آموزش دهد.",
    source: "سنن ترمذی",
  },
  {
    text: "الْعِلْمُ فِي الصِّغَرِ كَالنَّقْشِ عَلَى الْحَجَرِ",
    translation: "یادگیری در کودکی مانند حک کردن روی سنگ است.",
    source: "حضرت علی (ع)",
  },
  {
    text: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation: "هر که به خدا و روز قیامت ایمان دارد، یا سخن نیکو بگوید یا سکوت کند.",
    source: "صحیح بخاری",
  },
  {
    text: "الدُّعَاءُ هُوَ الْعِبَادَةُ",
    translation: "دعا خود عبادت است.",
    source: "سنن ترمذی",
  },
  {
    text: "مَنْ غَدَا فِي طَلَبِ الْعِلْمِ كَانَ فِي سَبِيلِ اللَّهِ",
    translation: "هر که صبح در طلب علم برود، در راه خداست.",
    source: "سنن ترمذی",
  },
  {
    text: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
    translation: "خداوند دوست دارد وقتی یکی از شما کاری انجام می‌دهد، آن را به‌خوبی انجام دهد.",
    source: "حضرت محمد (ص)",
  },
  {
    text: "الصَّبْرُ نِصْفُ الْإِيمَانِ",
    translation: "صبر نیمی از ایمان است.",
    source: "حضرت علی (ع)",
  },
];

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  // بررسی کش امروز
  if (supabase) {
    const { data: cached } = await supabase
      .from("hadith_cache")
      .select("*")
      .eq("date", today)
      .single();

    if (cached) {
      return NextResponse.json(cached);
    }
  }

  // انتخاب حدیث بر اساس روز سال
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const hadith = hadithBank[dayOfYear % hadithBank.length];

  // ذخیره در کش
  if (supabase) {
    await supabase.from("hadith_cache").insert({
      date: today,
      text: hadith.text,
      translation: hadith.translation,
      source: hadith.source,
    });
  }

  return NextResponse.json(hadith);
}
