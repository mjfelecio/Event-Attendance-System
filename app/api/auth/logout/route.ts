import { NextResponse } from "next/server";

import { err, ok } from "@/globals/utils/api";
import { clearAuthSession } from "@/globals/utils/auth";

export async function POST() {
  await clearAuthSession();
  return NextResponse.json(ok({ success: true }), { status: 200 });
}

export async function GET() {
  return NextResponse.json(err("Use POST to logout."), { status: 405 });
}
