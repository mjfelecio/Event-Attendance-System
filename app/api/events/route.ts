import { prisma } from "@/globals/libs/prisma";
import { NextResponse } from "next/server";

// Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany();

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events: " + error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Upsert (create or update based on `id`)
export async function POST(req: Request) {
  const {
    id,
    title,
    location,
    includedGroups,
    category,
    start,
    end,
    description,
    allDay,
  } = await req.json();

  let event;

  // Update if event exists, else create
  if (id) {
    event = await prisma.event.update({
      where: { id },
      data: {
        title,
        location,
        category,
        includedGroups,
        start,
        end,
        description,
        allDay,
      },
    });
  } else {
    event = await prisma.event.create({
      data: {
        title,
        location,
        category,
        includedGroups,
        start,
        end,
        description,
        allDay,
      },
    });
  }
  return NextResponse.json(event, { status: id ? 200 : 201 });
}

// Delete event
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing event id" }, { status: 400 });
  }

  await prisma.event.delete({
    where: { id },
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
