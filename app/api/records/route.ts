import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";

export async function POST(req: Request) {
  try {
    const { eventId, studentId, status, method } = await req.json();

    const record = await prisma.record.create({
      data: { eventId, studentId, status, method },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Failed to create record", error);
    return NextResponse.json(
      { message: "Failed to create record." },
      { status: 500 }
    );
  }
}

