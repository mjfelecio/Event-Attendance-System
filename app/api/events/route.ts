import { prisma } from "@/globals/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prisma.event.findMany();
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  const { title, location, category, start, end, description } = await req.json();
  const event = await prisma.event.create({
    data: { title, location, category, start, end, description },
  });
  return NextResponse.json(event, { status: 201 });
}