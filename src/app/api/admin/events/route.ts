import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get("fadak_admin")?.value !== "authenticated") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const title = form.get("title")?.toString();
  const dateFa = form.get("date_fa")?.toString();
  const speaker = form.get("speaker")?.toString() || "";
  const maddah = form.get("maddah")?.toString() || "کربلایی حسین طاهری";
  const status = form.get("status")?.toString() || "past";
  const description = form.get("description")?.toString() || "";

  if (!title || !dateFa) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "").slice(0, 80) || `event-${Date.now()}`;

  const { error } = await supabase.from("events").insert({
    title,
    slug,
    date_fa: dateFa,
    speaker,
    maddah,
    status,
    description,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  redirect("/admin/events?ok=1");
}
