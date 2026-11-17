import { NextResponse } from "next/server";
import { openSignup } from "@/lib/account-store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const result = await openSignup(String(body.phone || ""), String(body.code || ""));
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
