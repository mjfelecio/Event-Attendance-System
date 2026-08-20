import { NextResponse } from "next/server";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { setAuthSession } from "@/globals/utils/auth";
import {
  hashPassword,
  isHashedPassword,
  verifyPassword,
} from "@/globals/utils/password";
import { loginSchema } from "@/features/auth/schema/loginSchema";
import { clientKey, rateLimit } from "@/globals/utils/rateLimit";

export async function POST(req: Request) {
  try {
    const parsed = loginSchema.parse(await req.json());
    const email = parsed.email.trim().toLowerCase();
    const password = parsed.password;

    // 10 attempts per client+account per 5 minutes
    if (!rateLimit(`login:${clientKey(req)}:${email}`, 10, 5 * 60_000)) {
      return NextResponse.json(
        err("Too many login attempts. Try again in a few minutes."),
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(err("Invalid credentials."), { status: 401 });
    }

    // Transparently upgrade legacy plaintext rows to scrypt hashes.
    if (!isHashedPassword(user.password)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: await hashPassword(password) },
      });
    }

    if (user.status === "PENDING") {
      return NextResponse.json(err("Account pending admin approval."), {
        status: 403,
      });
    }

    if (user.status === "REJECTED") {
      return NextResponse.json(
        err(
          user.rejectionReason ??
            "Your registration was rejected. Please contact an administrator."
        ),
        { status: 403 }
      );
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      rejectionReason: user.rejectionReason,
      mustChangePassword: user.mustChangePassword,
    };

    await setAuthSession(session);

    return NextResponse.json(ok(session), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
