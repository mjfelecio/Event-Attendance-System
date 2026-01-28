import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { respondWithError } from "@/globals/utils/httpError";
import { setAuthSession } from "@/globals/utils/auth";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json(err("Invalid credentials."), { status: 401 });
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

    await setAuthSession({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      rejectionReason: user.rejectionReason,
    });

    return NextResponse.json(
      ok({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        rejectionReason: user.rejectionReason,
      }),
      { status: 200 }
    );
  } catch (error) {
    return respondWithError(error);
  }
}
