import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { requireAuth } from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    await requireAuth();
    const { recordId } = await params;

    const deletedRecord = await prisma.record.delete({
      where: { id: recordId },
    });

    return NextResponse.json(ok(deletedRecord), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}

/**
 * Updates the attendance of the record timein timeout of the record
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    await requireAuth();
    const { recordId } = await params;

    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: {
        event: true,
      },
    });

    if (!record) {
      return NextResponse.json(err("Record not found"), { status: 404 });
    }

    if (!record?.event) {
      return NextResponse.json(
        err("Cannot update record with no event attached"),
        { status: 404 }
      );
    }

    const recordedAt = new Date();

    // Time-in: first scan wins - never overwrite an existing time-in.
    // Time-out: latest scan wins - the student's final scan-out is kept.
    const toUpdate = record.event.isTimeout
      ? { timeout: recordedAt }
      : record.timein
        ? {}
        : { timein: recordedAt };

    const updatedRecord = await prisma.record.update({
      where: { id: record.id },
      data: {
        ...toUpdate,
      },
    });

    return NextResponse.json(ok(updatedRecord), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
