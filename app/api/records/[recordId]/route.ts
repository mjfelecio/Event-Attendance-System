import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { recordId: string } },
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

/**
 * Updates the attendance of the record timein timeout of the record
 */
export async function PATCH(
  req: NextRequest,
   { params }: { params: { recordId: string } }
  ) {
  try {
    const { recordId } = await params;

    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: {
        event: true
      }
    });

    if (!record) {
      return NextResponse.json(
        err("Record not found"),
        { status: 404 },
      );
    }

    if (!record?.event) {
      return NextResponse.json(
        err("Cannot update record with no event attached"),
        { status: 404 },
      );
    }

    const recordedAt = new Date();

    // Determine what data to update
    const toUpdate = record.event.isTimeout
      ? {
          timeout: recordedAt,
        }
      : {
          timein: recordedAt,
        };

    const updatedRecord = await prisma.record.update({
      where: { id: record.id },
      data: {
        ...toUpdate,
      },
    });

    return NextResponse.json(ok(updatedRecord), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    console.warn(JSON.stringify(e));
    return NextResponse.json(err(message), { status });
  }
}
