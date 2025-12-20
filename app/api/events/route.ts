import { prisma } from "@/globals/libs/prisma";
import { err, ok } from "@/globals/utils/api";
import { handlePrismaError } from "@/globals/utils/prismaError";
import { NextResponse } from "next/server";

// Fetch all events
export async function GET() {
  try {
    const events = await prisma.event.findMany();

    return NextResponse.json(ok(events), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}

// Upsert (create or update based on `id`)
export async function POST(req: Request) {
  try {
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

    const data = {
      title,
      location,
      category,
      includedGroups,
      start,
      end,
      description,
      allDay,
    };

    // Upsert logic (update if id exists, else create)
    const event = id
      ? await prisma.event.update({
          where: { id },
          data,
        })
      : await prisma.event.create({
          data,
        });

    const status = id ? 200 : 201;
    return NextResponse.json(ok(event), { status });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}

// Delete event
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(err("Missing event id"), { status: 400 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json(ok(null), { status: 200 });
  } catch (e) {
    const { status, message } = handlePrismaError(e);
    return NextResponse.json(err(message), { status });
  }
}
