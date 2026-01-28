import { NextResponse } from "next/server";

import { ok } from "@/globals/utils/api";
import { getAuthSession } from "@/globals/utils/auth";

export async function GET() {
  const session = await getAuthSession();
  return NextResponse.json(ok(session), { status: 200 });
}
