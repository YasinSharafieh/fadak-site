import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// وب‌هوک بات تلگرام فدک — پیام خصوصی + پست کانال (سینک خودکار آرشیو)
export async function POST(req: Request) {
  try {
    const update = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;

    // پست کانال → سینک خودکار به آرشیو
    const channelPost = update?.channel_post;
    if (channelPost?.text && supabase) {
      const text = channelPost.text as string;
      // اگر پست شامل هشتگ #مراسم باشد، به‌عنوان مراسم جدید ثبت کن
      if (text.includes("#مراسم") || text.includes("#روضه")) {
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
      return NextResponse.json({ ok: true });
    }

    const msg = update?.message;
    if (!msg?.text) return NextResponse.json({ ok: true });

    const chatId = msg.chat.id;
    const text = msg.text as string;

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
