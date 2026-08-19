import { basename } from "path";
import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { requireAuth, requireRole } from "@/globals/utils/auth";

import { version as appVersion } from "@/package.json";

const MIN_AUTH_SECRET_LENGTH = 16;

/**
 * Which SQLite file is actually in use, without leaking the path layout of the
 * host machine. `file:./prisma/dev.db` -> `dev.db`.
 */
function databaseFileName(): string {
  const url = process.env.DATABASE_URL ?? "";
  return basename(url.replace(/^file:/, "").split("?")[0]) || "unknown";
}

/**
 * GET /api/admin/system
 *
 * Read-only environment health for the operator console. It reports whether
 * configuration is *present and valid*, never the values themselves - no secret
 * is returned by this route under any condition.
 */
export async function GET() {
  try {
    const user = await requireAuth();
    requireRole(user, "ADMIN");

    const secret = process.env.AUTH_SECRET ?? "";

    const [students, groups, events, records, users] = await Promise.all([
      prisma.student.count(),
      prisma.group.count(),
      prisma.event.count(),
      prisma.record.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json(
      ok({
        nodeEnv: process.env.NODE_ENV ?? "unknown",
        databaseFile: databaseFileName(),
        authSecret: {
          configured: secret.length > 0,
          meetsMinLength: secret.length >= MIN_AUTH_SECRET_LENGTH,
          // In development an unset secret silently falls back to a shared
          // constant; that is fine locally and fatal in production.
          usingDevFallback:
            secret.length < MIN_AUTH_SECRET_LENGTH &&
            process.env.NODE_ENV !== "production",
        },
        appVersion,
        // Lets an operator confirm the host clock before an event without
        // leaving the app - a wrong clock silently produces wrong timestamps.
        serverTime: new Date().toISOString(),
        counts: { students, groups, events, records, users },
      }),
      { status: 200 },
    );
  } catch (error) {
    return respondWithError(error);
  }
}
