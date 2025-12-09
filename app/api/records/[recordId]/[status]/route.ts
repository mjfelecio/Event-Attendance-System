import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { recordId: string; status: AttendanceStatus } }
) {
  const { recordId: id, status } = await params;

  try {
    const updatedRecord = await prisma.record.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(ok(updatedRecord), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
