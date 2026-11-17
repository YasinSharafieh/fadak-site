import { NextResponse } from "next/server";
import { userFromToken } from "@/lib/account-store";
import { readSessionToken } from "@/lib/session";

export async function GET() {
  const user = await userFromToken(await readSessionToken());
  return NextResponse.json({ user });
}
