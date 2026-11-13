import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// استخراج تاریخ شمسی از متن (مثل 12 آبان، 14 مهر)
function extractDate(text: string): string | null {
  const months = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
  const m = text.match(/(\d{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  if (m) return `${m[1]} ${m[2]}`;
  const fa = text.match(/([۰-۹]{1,2})\s+(فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند)/);
  if (fa) {
    const num = fa[1].replace(/[۰-۹]/g, (d: string) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
    return `${num} ${fa[2]}`;
  }
  return null;
}

function parseCeremony(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let title = "";
  let speaker = "";
  let maddahs: string[] = [];
  let dateFa = "";
  let inMaddah = false;

  for (const line of lines) {
    if (line.includes("📌")) title = line.replace("📌|", "").replace("📌", "").trim();
    if (line.includes("سخنران")) {
      const parts = line.split(":");
      speaker = (parts[1] || "").trim();
      inMaddah = false;
    } else if (line.includes("مداحان") || line.includes("مداح :")) {
      inMaddah = true;
    } else if (line.includes("📅")) {
      dateFa = line.replace("📅|", "").replace("📅", "").trim();
      inMaddah = false;
    } else if (inMaddah) {
      if (line.includes("📅") || line.includes("⬇️") || line.includes("🔹") || line.includes("www.") || line.includes("💠") || line.includes("📷")) {
        inMaddah = false;
      } else if (line.startsWith("#") || line.includes("کربلایی") || line.includes("حاج")) {
        const clean = line.replace("#", "").replace(/_/g, " ").trim();
        if (clean && !clean.includes("فدائیان")) maddahs.push(clean);
      } else if (line.length > 0) {
        maddahs.push(line);
      }
    }
  }

  const speakerIdx = lines.findIndex((l) => l.includes("سخنران"));
  if (!speaker && speakerIdx >= 0 && lines[speakerIdx + 1]) speaker = lines[speakerIdx + 1].trim();

  const maddahStr = maddahs.length > 0 ? [...new Set(maddahs)].join("، ") : extractMaddahs(text);
  const descParts = [title, speaker ? `سخنران: ${speaker}` : "", maddahStr ? `مداحان: ${maddahStr}` : ""].filter(Boolean);
  const description = descParts.join("\n");

  return { title: title || "مراسم فدک", speaker, maddah: maddahStr, dateFa, description };
}

function extractMaddahs(text: string): string {
  const tags = text.match(/#کربلایی_[^\s#]+/g) || text.match(/#حاج_[^\s#]+/g) || [];
  const names = [...new Set(tags.map((t) => t.replace("#", "").replace(/_/g, " ").trim()))];
  return names.length > 0 ? names.join("، ") : "کربلایی حسین طاهری";
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "").slice(0, 80) || `event-${Date.now()}`;
}

// زیرنویس کوتاه از کپشن/متن
function getSubtitle(text: string): string {
  if (!text) return "";
  let sub = text.split("\n")[0].trim();
  sub = sub.split("مجلس")[0].trim();
  sub = sub.replace(/\|\s*$/, "").trim();
  sub = sub.replace(/#\S+/g, "").trim();
  // حذف ایموجی‌های اول خط
  sub = sub.replace(/^[🔊📷🎬📌📅\s]+/, "").trim();
  return sub.slice(0, 80);
}

// پیدا کردن یا ساخت مراسم
async function findOrCreateEvent(text: string) {
  if (!supabase) return null;
  const date = extractDate(text);
  const firstLine = text.split("\n")[0].trim().slice(0, 120);

  if (date) {
    const { data: existing } = await supabase
      .from("events")
      .select("*")
      .ilike("date_fa", `%${date}%`)
      .order("created_at", { ascending: false })
      .limit(1);
    if (existing && existing.length > 0) return existing[0];

    const title = firstLine.includes(date) ? firstLine : `روضه هفتگی ${date}`;
    const slug = slugify(title);
    const parsed = parseCeremony(text);
    const { data: created } = await supabase
      .from("events")
      .insert({ title: parsed.title, slug, date_fa: parsed.dateFa || date, speaker: parsed.speaker, status: "past", maddah: parsed.maddah, description: parsed.description })
      .select()
      .single();
    return created;
  }

  // بدون تاریخ: به آخرین مراسم بچسبان
  const { data: latest } = await supabase.from("events").select("*").order("created_at", { ascending: false }).limit(1).single();
  return latest || null;
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
      contentType: ext === "jpg" || ext === "png" ? `image/${ext}` : ext === "ogg" ? "audio/ogg" : ext === "mp3" ? "audio/mpeg" : "application/octet-stream",
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
  const isEventText = text.includes("#مراسم") || text.includes("#روضه") || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم") || text.includes("📌");

  // تصمیم‌گیری برای مراسم
  let event: any = null;
  if (isEventText && text) {
    event = await findOrCreateEvent(text);
  } else if (hasMedia) {
    // رسانه بدون متن مراسم → به آخرین مراسم بچسبان
    const { data: latest } = await supabase.from("events").select("*").order("created_at", { ascending: false }).limit(1).single();
    event = latest;
  } else if (text) {
    // فقط متن بدون رسانه و بدون کلمه کلیدی → نادیده بگیر
    return;
  }

  if (!event) return;

  const subtitle = getSubtitle(text);

  // عکس
  if (post.photo?.length) {
    const fileId = post.photo[post.photo.length - 1].file_id;
    const url = await downloadAndUpload(fileId, "photos", "jpg");
    if (url) await supabase.from("photos").insert({ event_id: event.id, url, caption: subtitle || "عکس مراسم" });
  }

  // صوت (voice یا audio)
  const audioFile = post.voice || post.audio;
  if (audioFile?.file_id) {
    const ext = audioFile.mime_type?.includes("mpeg") ? "mp3" : "ogg";
    const url = await downloadAndUpload(audioFile.file_id, "audios", ext);
    if (url) await supabase.from("audios").insert({ event_id: event.id, title: subtitle || audioFile.file_name || "صوت مراسم", file_url: url });
  }

  // ویدیو
  if (post.video?.file_id) {
    const url = await downloadAndUpload(post.video.file_id, "videos", "mp4");
    if (url) await supabase.from("photos").insert({ event_id: event.id, url, caption: subtitle || "ویدیو مراسم" });
  }

  // سند (document) - صوت یا ویدیو
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

    // پست کانال
    const channelPost = update?.channel_post;
    if (channelPost) {
      await handlePost(channelPost);
      return NextResponse.json({ ok: true });
    }

    // پیام مستقیم
    const msg = update?.message;
    if (!msg) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = (msg.text as string) || (msg.caption as string) || "";
    const hasMedia = Boolean(msg.photo || msg.voice || msg.audio || msg.video || msg.document);

    // همه پیام‌های رسانه‌ای یا فوروارد یا دارای کلمه کلیدی رو پردازش کن
    if (hasMedia || msg.forward_from || msg.forward_from_chat || text.includes("روضه") || text.includes("مجلس") || text.includes("مراسم")) {
      await handlePost(msg);
      if (token && hasMedia) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "✅ دریافت شد و به آرشیو اضافه شد!" }),
        });
      }
      return NextResponse.json({ ok: true });
    }

    // دستورات
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
