import { randomInt } from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { requireAuth, requireRole } from "@/globals/utils/auth";
import { hashPassword } from "@/globals/utils/password";

// No 0/O/1/l/I - the password gets read aloud or copied off a screen during an
// event, and an ambiguous character there costs more than the lost entropy.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ23456789";
const TEMP_PASSWORD_LENGTH = 12;

function generateTemporaryPassword(): string {
  let password = "";
  for (let i = 0; i < TEMP_PASSWORD_LENGTH; i++) {
    password += ALPHABET[randomInt(ALPHABET.length)];
  }
  return password;
}

/**
 * PATCH /api/admin/users/[userId]/password
 *
 * Admin-issued password recovery: the server generates a temporary password,
 * returns it exactly once, and flags the account so the user must replace it
 * before reaching the app. The admin never chooses the password, and it is
 * stored hashed - the legacy plaintext-then-rehash path is a runbook fallback,
 * not something to write new code against.
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await requireAuth();
    requireRole(admin, "ADMIN");

    const { userId } = await params;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!target) {
      return NextResponse.json(err("User not found.", "NOT_FOUND"), {
        status: 404,
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    await prisma.user.update({
      where: { id: target.id },
      data: {
        password: await hashPassword(temporaryPassword),
        mustChangePassword: true,
      },
    });

    return NextResponse.json(
      ok({
        id: target.id,
        name: target.name,
        email: target.email,
        temporaryPassword,
      }),
      { status: 200 },
    );
  } catch (error) {
    return respondWithError(error);
  }
}
