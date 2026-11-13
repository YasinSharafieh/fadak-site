import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// استخراج تاریخ شمسی از متن (مثل 12 آبان، 14 مهر)
function extractDate(text: string): string | null {
  const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
  const m = text.match(/(\d{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  if (m) return `${m[1]} ${m[2]}`;
  // اعداد فارسی
  const fa = text.match(/([۰-۹]{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  if (fa) {
    const num = fa[1].replace(/[۰-۹]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
    return `${num} ${fa[2]}`;
  }
  return null;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "").slice(0, 80) || `event-${Date.now()}`;
}

// پیدا کردن یا ساخت مراسم بر اساس تاریخ/عنوان
async function findOrCreateEvent(text: string) {
  if (!supabase) return null;
  const date = extractDate(text);
  const firstLine = text.split("\n")[0].trim().slice(0, 120);

  // اگر تاریخ پیدا شد، دنبال مراسم همون تاریخ بگرد
  if (date) {
    const { data: existing } = await supabase
      .from("events")
      .select("*")
      .ilike("title", `%${date}%`)
      .order("created_at", { ascending: false })
      .limit(1);
    if (existing && existing.length > 0) return existing[0];

    // مراسم جدید با عنوان شامل تاریخ بساز
    const title = firstLine.includes(date) ? firstLine : `روضه هفتگی ${date}`;
    const slug = slugify(title);
    const { data: created } = await supabase
      .from("events")
      .insert({ title, slug, date_fa: date, status: "past", maddah: "کربلایی حسین طاهری", description: text.slice(0, 2000) })
      .select()
      .single();
    return created;
  }

  // بدون تاریخ: اگر پست فقط رسانه است، به آخرین مراسم بچسبان
  const isMediaOnly = !text || text.length < 10;
  if (isMediaOnly) {
    const { data: latest } = await supabase.from("events").select("*").order("created_at", { ascending: false }).limit(1).single();
    return latest || null;
  }

  // پست متنی جدید → مراسم جدید
  const slug = slugify(firstLine);
  const { data: created } = await supabase
    .from("events")
    .insert({ title: firstLine || "مراسم فدک", slug, status: "past", maddah: "کربلایی حسین طاهری", description: text.slice(0, 2000) })
    .select()
    .single();
  return created;
}

async function downloadAndUpload(fileId: string, bucket: string, ext: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !supabase) return null;
  try {
    const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
    const fileJson: any = await fileRes.json();
    const filePath = fileJson?.result?.file_path;
    if (!filePath) return null;
    const dlRes = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
    const buf = await dlRes.arrayBuffer();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(name, buf, {
      contentType: ext === "jpg" || ext === "png" ? `image/${ext}` : ext === "ogg" ? "audio/ogg" : "application/octet-stream",
      upsert: true,
    });
    if (error) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(name);
    return data.publicUrl;
  } catch {
    return null;
  }
}

async function handlePost(post: any) {
  if (!supabase) return;
  const text = (post.text as string) || (post.caption as string) || "";
  const hasMedia = Boolean(post.photo || post.voice || post.audio || post.video || post.document);
  const isEventText = text.includes("#مراسم") || text.includes("#روضه") || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم");

  // فقط پست‌های متنی مراسم، مراسم جدید می‌سازن؛ رسانه‌ها به مراسم موجود وصل می‌شن
  let event: any = null;
  if (isEventText && text && !hasMedia) {
    event = await findOrCreateEvent(text);
  } else if (isEventText && text && hasMedia) {
    // پست متن+رسانه: اگر مراسم همون تاریخ هست، همون رو استفاده کن، وگرنه جدید بساز
    event = await findOrCreateEvent(text);
  } else if (hasMedia) {
    // رسانه بدون متن مراسم → به آخرین مراسم بچسبان
    const { data: latest } = await supabase.from("events").select("*").order("created_at", { ascending: false }).limit(1).single();
    event = latest;
  }

  if (!event) return;

  // زیرنویس = خط اول متن (مثل شور | یوحنا)
  const subtitle = text ? text.split("\n")[0].trim().slice(0, 120) : "";

  if (post.photo?.length) {
    const fileId = post.photo[post.photo.length - 1].file_id;
    const url = await downloadAndUpload(fileId, "photos", "jpg");
    if (url) await supabase.from("photos").insert({ event_id: event.id, url, caption: subtitle });
  }
  const audioFile = post.voice || post.audio;
  if (audioFile?.file_id) {
    const url = await downloadAndUpload(audioFile.file_id, "audios", "ogg");
    if (url) await supabase.from("audios").insert({ event_id: event.id, title: subtitle || "صوت مراسم", file_url: url });
  }
  if (post.video?.file_id) {
    const url = await downloadAndUpload(post.video.file_id, "videos", "mp4");
    if (url) await supabase.from("photos").insert({ event_id: event.id, url, caption: subtitle || "ویدیو مراسم" });
  }
  if (post.document?.file_id) {
    const mime = post.document.mime_type || "";
    const ext = (post.document.file_name || "file").split(".").pop() || "bin";
    if (mime.startsWith("audio")) {
      const url = await downloadAndUpload(post.document.file_id, "audios", ext);
      if (url) await supabase.from("audios").insert({ event_id: event.id, title: subtitle || post.document.file_name || "صوت مراسم", file_url: url });
    } else if (mime.startsWith("video")) {
      const url = await downloadAndUpload(post.document.file_id, "videos", ext);
      if (url) await supabase.from("photos").insert({ event_id: event.id, url, caption: subtitle || "ویدیو مراسم" });
    }
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    const channelPost = update?.channel_post;
    if (channelPost) {
      await handlePost(channelPost);
      return NextResponse.json({ ok: true });
    }

    const msg = update?.message;
    if (!msg) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = (msg.text as string) || (msg.caption as string) || "";
    const isForward = Boolean(msg.forward_from || msg.forward_from_chat);

    if (isForward || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم")) {
      await handlePost(msg);
      if (token) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "✅ دریافت شد و به آرشیو اضافه شد!" }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (msg.photo || msg.voice || msg.audio || msg.video || msg.document) {
      await handlePost(msg);
      return NextResponse.json({ ok: true });
    }

    let reply = "سلام! من بات فدک هستم. /events برای مراسم آینده، /hadith برای حدیث روز";
    if (text.startsWith("/events")) {
      reply = "مراسم آینده: مجلس روضه هفتگی — سه‌شنبه ۲۱ آبان ۱۴۰۵ ساعت ۱۹:۳۰، حسینیه سیدالشهدا (ع) تهران. جزئیات: https://fadak-site-murex.vercel.app/events";
    } else if (text.startsWith("/hadith")) {
      reply = "حدیث روز: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ — همانا اعمال به نیت‌ها بستگی دارد.";
    } else if (text.startsWith("/start")) {
      reply = "سلام! به بات فدک خوش آمدید. /events مراسم آینده | /hadith حدیث روز | /link صفحات حسین طاهری";
    } else if (text.startsWith("/link")) {
      reply = "صفحات حسین طاهری: https://fadak-site-murex.vercel.app/link";
    }

    if (token) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: reply }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
