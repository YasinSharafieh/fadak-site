import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// حدیث روز — فعلاً از کش Supabase، بعداً از API حدیث
export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  if (supabase) {
    const { data } = await supabase.from("hadith_cache").select("*").eq("day", today).single();
    if (data) return NextResponse.json(data);
  }
  return NextResponse.json({
    text: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    translation: "همانا اعمال به نیت‌ها بستگی دارد.",
    source: "پیامبر اکرم (ص) — بحارالانوار",
  });
}
