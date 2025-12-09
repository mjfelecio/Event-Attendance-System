import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { recordId: string } }
) {
  const { recordId } = await params;

  try {
    const deletedRecord = await prisma.record.delete({
      where: { id: recordId },
    });

    return NextResponse.json(ok(deletedRecord), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
