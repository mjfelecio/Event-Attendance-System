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

    // Scan rules: exactly one scan each for time-in and time-out, and a
    // time-out is only possible after a time-in.
    if (record.event.isTimeout) {
      if (!record.timein) {
        return NextResponse.json(
          err("Student has not timed in for this event.", "NO_TIME_IN"),
          { status: 409 }
        );
      }

      if (record.timeout) {
        return NextResponse.json(ok(record), { status: 200 });
      }

      const updatedRecord = await prisma.record.update({
        where: { id: record.id },
        data: { timeout: recordedAt },
      });

      return NextResponse.json(ok(updatedRecord), { status: 200 });
    }

    if (record.timein) {
      return NextResponse.json(ok(record), { status: 200 });
    }

    const updatedRecord = await prisma.record.update({
      where: { id: record.id },
      data: { timein: recordedAt },
    });

    return NextResponse.json(ok(updatedRecord), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
