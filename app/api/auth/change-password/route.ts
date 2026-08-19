import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { requireAuth, setAuthSession } from "@/globals/utils/auth";
import { hashPassword, verifyPassword } from "@/globals/utils/password";
import { changePasswordSchema } from "@/features/auth/schema/changePasswordSchema";
import { rateLimit } from "@/globals/utils/rateLimit";

/**
 * POST /api/auth/change-password
 *
 * Any signed-in user changes their own password. Deliberately guarded by
 * `requireAuth()` alone: a user holding an admin-issued temporary password is
 * ACTIVE and must be able to reach this route to clear the forced-change gate.
 */
export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      await req.json(),
    );

    // Keyed by user, not by client address - the LAN deployment collapses
    // every device onto one X-Forwarded-For hop.
    if (!rateLimit(`changePassword:${session.id}`, 10, 5 * 60_000)) {
      return NextResponse.json(
        err("Too many attempts. Try again in a few minutes."),
        { status: 429 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, password: true },
    });

    if (!user || !(await verifyPassword(currentPassword, user.password))) {
      return NextResponse.json(
        err("Current password is incorrect.", "INVALID_CREDENTIALS"),
        { status: 401 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(newPassword),
        mustChangePassword: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        rejectionReason: true,
        mustChangePassword: true,
      },
    });

    // Re-sign the cookie so the cleared flag is reflected without a re-login.
    await setAuthSession(updated);

    return NextResponse.json(ok(updated), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
