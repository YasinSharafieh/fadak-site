import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { amount, name } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (supabase) {
    await supabase.from("donations").insert({
      amount,
      donor_name: name || null,
      status: "pending",
    });
  }

  return NextResponse.json({ ok: true });
}
