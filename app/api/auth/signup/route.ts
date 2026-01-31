import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const { name, email, password } = signupSchema.parse(await req.json());

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
        password,
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
