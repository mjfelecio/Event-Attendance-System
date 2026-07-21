import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import {
  assertEventOwnership,
  assertEventStatus,
  assertEventVisibility,
  requireAuth,
} from "@/globals/utils/auth";
import { respondWithError } from "@/globals/utils/httpError";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  try {
    const user = await requireAuth();
    const { recordId } = await params;

    const record = await prisma.record.findUnique({
      where: { id: recordId },
      include: { event: true },
    });

    if (!record) {
      return NextResponse.json(err("Record not found"), { status: 404 });
    }

    // Only the event's owner or an admin may erase attendance evidence.
    assertEventOwnership(record.event, user);

    const deletedRecord = await prisma.record.delete({
      where: { id: recordId },
    });

    console.info(
      `[audit] record ${recordId} (event ${record.eventId}, student ${record.studentId}) deleted by user ${user.id}`
    );

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
    const user = await requireAuth();
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

    // Attendance can only be updated on approved events the user can see.
    assertEventVisibility(record.event, user);
    assertEventStatus(record.event, "APPROVED");

    const recordedAt = new Date();

    // Scan rules: exactly one scan each for time-in and time-out, and a
    // time-out is only possible after a time-in. Writes are conditional
    // (compare-and-set) so concurrent requests cannot overwrite the first.
    if (record.event.isTimeout) {
      if (!record.timein) {
        return NextResponse.json(
          err("Student has not timed in for this event.", "NO_TIME_IN"),
          { status: 409 }
        );
      }

      if (!record.timeout) {
        await prisma.record.updateMany({
          where: { id: record.id, timeout: null },
          data: { timeout: recordedAt, lastModifiedById: user.id },
        });
      }
    } else if (!record.timein) {
      await prisma.record.updateMany({
        where: { id: record.id, timein: null },
        data: { timein: recordedAt, lastModifiedById: user.id },
      });
    }

    const updatedRecord = await prisma.record.findUnique({
      where: { id: record.id },
    });

    return NextResponse.json(ok(updatedRecord), { status: 200 });
  } catch (error) {
    return respondWithError(error);
  }
}
