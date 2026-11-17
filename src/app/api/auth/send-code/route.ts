import { NextResponse } from "next/server";
import { sendLoginCode } from "@/lib/account-store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await sendLoginCode(String(body.phone || ""));
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
