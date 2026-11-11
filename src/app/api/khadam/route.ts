import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const form = await req.formData();
  const full_name = String(form.get("full_name") || "");
  const mobile = String(form.get("mobile") || "");
  const city = String(form.get("city") || "");
  const service_type = String(form.get("service_type") || "");

  if (!full_name || !mobile) {
    return NextResponse.redirect(new URL("/khadam?error=1", req.url));
  }

  if (supabase) {
    await supabase.from("khadam_requests").insert({ full_name, mobile, city, service_type });
  }

  return NextResponse.redirect(new URL("/khadam?ok=1", req.url));
}
