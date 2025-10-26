import { prisma } from "@/globals/libs/prisma";
import { AttendanceStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; type: AttendanceStatus } }
) {
  const { id, type } = await params;

  try {
    const updatedRecord = await prisma.record.update({
      where: { id },
      data: { status: type }
    });

    if (!updatedRecord) {
      return NextResponse.json(
        { error: "Record not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update record" }, 
      { status: 500 }
    );
  }
}
