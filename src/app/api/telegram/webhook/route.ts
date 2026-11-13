import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// وب‌هوک بات تلگرام فدک — متن + عکس + صوت + ویدیو → آرشیو به تفکیک مراسم
async function getLatestEventId() {
  if (!supabase) return null;
  const { data } = await supabase
    .from("events")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data?.id || null;
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

async function handleMedia(msg: any) {
  if (!supabase) return;
  const eventId = await getLatestEventId();
  if (!eventId) return;

  // عکس
  if (msg.photo?.length) {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const url = await downloadAndUpload(fileId, "photos", "jpg");
    if (url) await supabase.from("photos").insert({ event_id: eventId, url, caption: msg.caption || "" });
  }
  // ویس / صوت
  const audioFile = msg.voice || msg.audio;
  if (audioFile?.file_id) {
    const url = await downloadAndUpload(audioFile.file_id, "audios", "ogg");
    if (url) await supabase.from("audios").insert({ event_id: eventId, title: msg.caption || "صوت مراسم", file_url: url });
  }
  // ویدیو
  if (msg.video?.file_id) {
    const url = await downloadAndUpload(msg.video.file_id, "videos", "mp4");
    if (url) await supabase.from("photos").insert({ event_id: eventId, url, caption: "ویدیو مراسم" });
  }
  // سند (mp3 و...)
  if (msg.document?.file_id) {
    const mime = msg.document.mime_type || "";
    const isAudio = mime.startsWith("audio");
    const isVideo = mime.startsWith("video");
    const ext = (msg.document.file_name || "file").split(".").pop() || "bin";
    if (isAudio) {
      const url = await downloadAndUpload(msg.document.file_id, "audios", ext);
      if (url) await supabase.from("audios").insert({ event_id: eventId, title: msg.document.file_name || "صوت مراسم", file_url: url });
    } else if (isVideo) {
      const url = await downloadAndUpload(msg.document.file_id, "videos", ext);
      if (url) await supabase.from("photos").insert({ event_id: eventId, url, caption: "ویدیو مراسم" });
    }
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    // پست کانال
    const channelPost = update?.channel_post;
    if (channelPost) {
      const text = (channelPost.text as string) || (channelPost.caption as string) || "";
      const isEventText = text.includes("#مراسم") || text.includes("#روضه") || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم");
      if (isEventText && supabase && text) {
        const firstLine = text.split("\n")[0].slice(0, 120);
        const slug = `tg-${channelPost.message_id}-${Date.now()}`;
        await supabase.from("events").insert({
          title: firstLine || "مراسم فدک",
          slug,
          status: "past",
          maddah: "کربلایی حسین طاهری",
          description: text.slice(0, 2000),
        });
      }
      // رسانه پست کانال → به آخرین مراسم بچسبان
      await handleMedia(channelPost);
      return NextResponse.json({ ok: true });
    }

    const msg = update?.message;
    if (!msg) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = (msg.text as string) || (msg.caption as string) || "";
    const isForward = Boolean(msg.forward_from || msg.forward_from_chat);
    const isEventText = text.includes("#مراسم") || text.includes("#روضه") || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم");

    if ((isForward || isEventText) && supabase && text) {
      const firstLine = text.split("\n")[0].slice(0, 120);
      const slug = `fwd-${msg.message_id}-${Date.now()}`;
      await supabase.from("events").insert({
        title: firstLine || "مراسم فدک",
        slug,
        status: "past",
        maddah: "کربلایی حسین طاهری",
        description: text.slice(0, 2000),
      });
      await handleMedia(msg);
      if (token) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "✅ مراسم و رسانه‌ها دریافت شد و به آرشیو اضافه شد!" }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    // فقط رسانه بدون متن → به آخرین مراسم بچسبان
    if (msg.photo || msg.voice || msg.audio || msg.video || msg.document) {
      await handleMedia(msg);
      return NextResponse.json({ ok: true });
    }

    let reply = "سلام! من بات فدک هستم. /events برای مراسم آینده، /hadith برای حدیث روز";

    if (text.startsWith("/events")) {
      reply = "مراسم آینده: مجلس روضه هفتگی — سه‌شنبه ۲۱ آبان ۱۴۰۵ ساعت ۱۹:۳۰، حسینیه سیدالشهدا (ع) تهران. جزئیات: https://fadak-site-murex.vercel.app/events";
    } else if (text.startsWith("/hadith")) {
      reply = "حدیث روز: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ — همانا اعمال به نیت‌ها بستگی دارد.";
    } else if (text.startsWith("/start")) {
      reply = "سلام! به بات فدک خوش آمدید. /events مراسم آینده | /hadith حدیث روز | /link صفحات حسین طاهری\n\nبرای اضافه شدن به آرشیو، پست مراسم رو فوروارد کن.";
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
