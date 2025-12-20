import { NextResponse } from "next/server";
import { prisma } from "@/globals/libs/prisma";
import {
  mapStudentToRow,
  mapStudentToSource,
  slugify,
} from "@/features/manage-list/utils/mapStudentToRow";
import { Prisma } from "@prisma/client";
import { studentUpdateSchema } from "@/features/manage-list/utils/studentSchemas";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

const createSlugPayload = (data: { department?: string; house?: string }) => {
  const departmentSlug = data.department
    ? slugify(data.department) ?? null
    : null;
  const houseSlug = data.house ? slugify(data.house) ?? null : null;
  return { departmentSlug, houseSlug };
};

// Fetching a single student by id
export async function GET(
  req: Request,
  { params }: { params: { id: string; eventId: string } }
) {
  const { id, eventId } = await params;

  try {
    let student;
    let event;

    if (eventId) {
      event = await prisma.event.findUnique({ where: { id: eventId } });
    } else {
      event = undefined;
    }

    if (event) {
      student = await prisma.student.findFirst({
        where: buildEventStudentFilter(event),
      });
    } else {
      student = await prisma.student.findUnique({
        where: {
          id,
        },
      });
    }

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const payload = await request.json();
    const data = studentUpdateSchema.parse({ ...payload, id });

    const { departmentSlug, houseSlug } = createSlugPayload(data);

    const student = await prisma.student.update({
      where: { id },
      data: {
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName,
        schoolLevel: data.schoolLevel,
        shsStrand: data.schoolLevel === "SHS" ? data.shsStrand : null,
        collegeProgram:
          data.schoolLevel === "COLLEGE" ? data.collegeProgram : null,
        section: data.section,
        yearLevel: data.yearLevel,
        status: data.status,
        contactNumber: data.contactNumber,
        department: data.department,
        departmentSlug,
        house: data.house,
        houseSlug,
      },
    });

    const studentRow = mapStudentToRow(
      mapStudentToSource({
        ...student,
        name: `${student.firstName} ${student.lastName}`.trim(),
      })
    );

    return NextResponse.json({ student: studentRow });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Student not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to update student." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Student not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to delete student." },
      { status: 500 }
    );
  }
}
