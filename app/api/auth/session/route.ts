import { NextResponse } from "next/server";

import { ok } from "@/globals/utils/api";
import { getFreshAuthSession } from "@/globals/utils/auth";

export async function GET() {
  // Revalidated against the database so the UI reflects role/status changes
  // (approval, rejection, demotion) without waiting for cookie expiry.
  const session = await getFreshAuthSession();
  return NextResponse.json(ok(session), { status: 200 });
}
