import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const form = await req.formData();
  const title = String(form.get("title") || "");
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "") || `event-${Date.now()}`;
  const date_fa = String(form.get("date_fa") || "");
  const date_hijri = String(form.get("date_hijri") || "");
  const maddah = String(form.get("maddah") || "کربلایی حسین طاهری");
  const location = String(form.get("location") || "");
  const status = String(form.get("status") || "upcoming");

  if (!title) return NextResponse.redirect(new URL("/admin/events?error=1", req.url));

  if (supabase) {
    await supabase.from("events").insert({ title, slug, date_fa, date_hijri, maddah, location, status });
  }

  return NextResponse.redirect(new URL("/admin/events?ok=1", req.url));
}
