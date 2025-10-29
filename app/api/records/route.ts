import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, studentId, status, method } = await req.json();

    const alreadyExists = await prisma.record.findUnique({
      where: { eventId_studentId: { eventId, studentId } },
    });

    if (alreadyExists) {
      console.error("This record already exists");
      return NextResponse.json(
        { message: "This record already exists" },
        { status: 409 }
      );
    }

    const record = await prisma.record.create({
      data: { eventId, studentId, status, method },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Failed to create record: ", error);
    return NextResponse.json(
      { message: "Failed to create record." },
      { status: 500 }
    );
  }
}
