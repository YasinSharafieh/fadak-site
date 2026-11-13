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
  const eventId = form.get("event_id")?.toString();
  const title = form.get("title")?.toString();
  const file = form.get("file") as File | null;

  if (!eventId || !title || !file) {
    return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const ext = file.name.split(".").pop() || "mp3";
  const fileName = `${eventId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("audios").upload(fileName, file, { upsert: true });
  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("audios").getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("audios").insert({
    event_id: eventId,
    title,
    file_url: urlData.publicUrl,
  });
  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
  }

  redirect("/admin/upload?ok=1");
}
