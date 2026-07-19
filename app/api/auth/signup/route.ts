import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { hashPassword } from "@/globals/utils/password";
import { clientKey, rateLimit } from "@/globals/utils/rateLimit";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const parsed = signupSchema.parse(await req.json());
    const name = parsed.name;
    // Normalized so case-variant duplicate accounts are impossible
    const email = parsed.email.trim().toLowerCase();
    const password = parsed.password;

    // 5 signups per client per 10 minutes
    if (!rateLimit(`signup:${clientKey(req)}`, 5, 10 * 60_000)) {
      return NextResponse.json(
        err("Too many signup attempts. Try again in a few minutes."),
        { status: 429 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json(err("Email is already registered."), {
        status: 409,
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        role: "ORGANIZER",
        status: "PENDING",
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });

    return NextResponse.json(
      ok({
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      }),
      { status: 201 }
    );
  } catch (error) {
    return respondWithError(error);
  }
}
