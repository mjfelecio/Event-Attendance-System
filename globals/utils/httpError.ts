import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { err } from "@/globals/utils/api";
import { AuthError } from "@/globals/utils/auth";
import { handlePrismaError } from "@/globals/utils/prismaError";

export function respondWithError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(err(error.message, error.code), {
      status: error.status,
    });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(err("Invalid request payload."), {
      status: 400,
    });
  }

  const { status, message } = handlePrismaError(error);
  return NextResponse.json(err(message), { status });
}
