import { prisma } from "@/globals/libs/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const deletedRecord = await prisma.record.delete({
      where: { id },
    });

    return NextResponse.json(deletedRecord, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);

    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
