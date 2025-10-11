import { AttendanceMethod, AttendanceStatus, Prisma, PrismaClient, SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to pick random element from an array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const slugify = (value: string | null | undefined) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function main() {
  // Create users
  const organizer = await prisma.user.create({
    data: {
      name: "Alice Organizer",
      email: "alice@example.com",
      password: "password123",
      role: "ORGANIZER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Bob Admin",
      email: "bob@example.com",
      password: "adminpass123",
      role: "ADMIN",
    },
  });

  // Create events
  const eventsData = [
    {
      title: "Programmers Guild Meeting",
      location: "Room 204, CS Building",
      description: "Monthly guild meetup to discuss projects and share knowledge",
      category: "Meeting",
      start: new Date("2025-09-27T20:00:00Z"),
      end: new Date("2025-09-27T21:00:00Z"),
      allDay: false,
      userId: organizer.id,
    },
    {
      title: "Paytaca Cashscript Workshop",
      location: "Innovation Lab",
      description: "Two-day hands-on workshop on Cashscript development",
      category: "Workshop",
      start: new Date("2025-10-01T00:00:00Z"),
      end: new Date("2025-10-02T00:00:00Z"),
      allDay: true,
      userId: organizer.id,
    },
    {
      title: "Orientation Day",
      location: "Auditorium",
      description: "Kickoff event for new students",
      category: "School",
      start: new Date("2025-10-03T09:00:00Z"),
      end: new Date("2025-10-03T12:00:00Z"),
      allDay: false,
      userId: organizer.id,
    },
    {
      title: "Hackathon 2025",
      location: "Tech Hub",
      description: "24-hour coding event",
      category: "Competition",
      start: new Date("2025-10-05T10:00:00Z"),
      end: new Date("2025-10-06T10:00:00Z"),
      allDay: false,
      userId: organizer.id,
    },
    {
      title: "Founders’ Day",
      location: "Main Campus Grounds",
      description: "Annual celebration with activities, food stalls, and concerts",
      category: "Holiday",
      start: new Date("2025-12-15T00:00:00Z"),
      end: new Date("2025-12-15T00:00:00Z"),
      allDay: true,
      userId: organizer.id,
    },
  ];

  const events = await prisma.event.createMany({
    data: eventsData,
  });

  // Create students
  const studentsData: Array<Prisma.StudentCreateInput> = [
    {
      id: "20250000001",
      lastName: "Doe",
      firstName: "John",
      middleName: "Alexander",
      shsStrand: "STEM",
      section: "A",
      yearLevel: YearLevel.GRADE_12,
      schoolLevel: SchoolLevel.SHS,
      status: StudentStatus.ACTIVE,
      contactNumber: "09171234567",
      department: "Academic",
      departmentSlug: slugify("Academic") ?? undefined,
    },
    {
      id: "20250000002",
      lastName: "Smith",
      firstName: "Jane",
      middleName: "Louise",
      collegeProgram: "Computer Science",
      section: "B",
      yearLevel: YearLevel.YEAR_3,
      schoolLevel: SchoolLevel.COLLEGE,
      status: StudentStatus.ACTIVE,
      contactNumber: "09179876543",
      department: "CS",
      departmentSlug: slugify("CS") ?? undefined,
      house: "Giallio",
      houseSlug: slugify("Giallio") ?? undefined,
    },
    {
      id: "20250000003",
      lastName: "Tan",
      firstName: "Alice",
      shsStrand: "ABM",
      section: "C",
      yearLevel: YearLevel.GRADE_11,
      schoolLevel: SchoolLevel.SHS,
      status: StudentStatus.ACTIVE,
      department: "Academic",
      departmentSlug: slugify("Academic") ?? undefined,
    },
  ];

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: student,
      create: student,
    });
  }

  // Fetch all events and students
  const allEvents = await prisma.event.findMany();
  const allStudents = await prisma.student.findMany();

  // Attendance statuses and methods for random generation
  const statuses: AttendanceStatus[] = ["PRESENT", "LATE", "EXCUSED", "ABSENT"];
  const methods: AttendanceMethod[] = ["MANUAL", "SCANNED"];

  // Generate attendance records for every student for every event
  const recordsData: Prisma.RecordCreateManyInput[] = [];

  for (const event of allEvents) {
    for (const student of allStudents) {
      recordsData.push({
        eventId: event.id,
        studentId: student.id,
        status: randomChoice(statuses),
        method: randomChoice(methods),
      });
    }
  }

  await prisma.record.createMany({
    data: recordsData,
  });

  console.log("✅ Seed data with events, students, and attendance records inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
