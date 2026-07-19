import {
  AttendanceMethod,
  Event,
  EventCategory,
  Prisma,
  PrismaClient,
  SchoolLevel,
  StudentStatus,
  YearLevel,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  isStudentInEvent,
} from "@/globals/utils/buildEventStudentFilter";
import { hashPassword } from "@/globals/utils/password";
import {
  buildSectionName,
  COLLEGE_PROGRAMS,
  DEPARTMENTS,
  departmentBySlug,
  HOUSES as HOUSE_INFO,
  SHS_STRANDS as STRAND_INFO,
} from "@/globals/constants/groups";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || ":memory:",
});
const prisma = new PrismaClient({ adapter });

// Utility functions
const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const slugify = (value: string | null | undefined): string | undefined =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Constants
const SECTION_LETTERS = ["A", "B", "C"];
const EVENT_CATEGORIES: EventCategory[] = [
  "ALL",
  "COLLEGE",
  "SHS",
  "DEPARTMENT",
  "STRAND",
  "HOUSE",
  "PROGRAM",
  "SECTION",
  "YEAR",
];

const EVENT_TITLES: Record<EventCategory, string[]> = {
  ALL: [
    "General Assembly",
    "Whole School Gathering",
    "All Hands Meeting",
    "Campus-Wide Event",
    "Open Forum",
  ],
  COLLEGE: [
    "College Convocation",
    "College Seminar",
    "College Workshop",
    "College Sports Day",
    "College Awards Night",
  ],
  SHS: [
    "Senior High Assembly",
    "SHS Orientation",
    "SHS Competition",
    "SHS Cultural Night",
    "SHS Academic Forum",
  ],
  DEPARTMENT: [
    "Department Meeting",
    "Department Workshop",
    "Department Seminar",
    "Department Awards",
    "Department Gathering",
  ],
  STRAND: [
    "Strand-Specific Training",
    "Strand Workshop",
    "Strand Competition",
    "Strand Meeting",
    "Strand Project Showcase",
  ],
  HOUSE: [
    "House Assembly",
    "House Competition",
    "House Building Activity",
    "House Meeting",
    "House Awards Ceremony",
  ],
  PROGRAM: [
    "Program Orientation",
    "Program Workshop",
    "Program Competition",
    "Program Meeting",
    "Program Showcase",
  ],
  SECTION: [
    "Section Meeting",
    "Section Activity",
    "Section Gathering",
    "Section Workshop",
    "Section Event",
  ],
  YEAR: [
    "Year Level Assembly",
    "Year Level Workshop",
    "Year Level Competition",
    "Year Level Meeting",
    "Year Level Activity",
  ],
};

const LOCATIONS = [
  "Room 204, CS Building",
  "Innovation Lab",
  "Auditorium",
  "Tech Hub",
  "Main Campus Grounds",
  "Conference Room A",
  "Gymnasium",
  "Open Field",
  "Student Center",
  "Lecture Hall 101",
];

// Data generation functions

/** Pool of valid group values per event category - same vocabulary the app uses. */
const groupPoolFor = (
  category: EventCategory,
  sectionPool: string[]
): string[] => {
  switch (category) {
    case "DEPARTMENT":
      return DEPARTMENTS.map((d) => d.slug);
    case "HOUSE":
      return HOUSE_INFO.map((h) => h.slug);
    case "PROGRAM":
      return COLLEGE_PROGRAMS.map((p) => p.code);
    case "STRAND":
      return STRAND_INFO.map((s) => s.code);
    case "YEAR":
      return Object.keys(YearLevel);
    case "SECTION":
      return sectionPool;
    default:
      return [];
  }
};

const randomSubset = <T>(pool: T[], max: number): T[] => {
  const count = Math.min(pool.length, 1 + Math.floor(Math.random() * max));
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
};

function generateEvent(
  organizerId: string,
  baseDate: Date,
  index: number,
  sectionPool: string[],
): Prisma.EventCreateManyInput {
  const eventType = randomChoice(EVENT_CATEGORIES);
  const isAllDay = Math.random() < 0.3;

  const startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() + index * 2);
  startDate.setHours(randomChoice([8, 9, 10, 13, 14, 15]), 0, 0, 0);

  const endDate = new Date(startDate);
  if (isAllDay) {
    endDate.setHours(23, 59, 59, 999);
  } else {
    endDate.setHours(startDate.getHours() + randomChoice([1, 2, 3, 4]));
  }

  const title = randomChoice(EVENT_TITLES[eventType]);
  const pool = groupPoolFor(eventType, sectionPool);
  const includedGroups = pool.length > 0 ? randomSubset(pool, 3) : [];

  // ~25% of events exclude one narrower group (cross-level exclusion)
  let excludedGroups: string | null = null;
  if (Math.random() < 0.25) {
    const exclusionType = randomChoice([
      "PROGRAM",
      "HOUSE",
      "STRAND",
      "SECTION",
    ] as const);
    const exclusionPool = groupPoolFor(exclusionType, sectionPool).filter(
      (v) => !includedGroups.includes(v)
    );
    if (exclusionPool.length > 0) {
      excludedGroups = JSON.stringify([
        { type: exclusionType, value: randomChoice(exclusionPool) },
      ]);
    }
  }

  return {
    title,
    location: randomChoice(LOCATIONS),
    description: faker.lorem.sentence(),
    category: eventType,
    includedGroups: JSON.stringify(includedGroups),
    excludedGroups,
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    createdById: organizerId,
    isTimeout: randomChoice([true, false]),
  };
}

const YEAR_NUMBER: Record<YearLevel, number> = {
  YEAR_1: 1,
  YEAR_2: 2,
  YEAR_3: 3,
  YEAR_4: 4,
  GRADE_11: 11,
  GRADE_12: 12,
};

function generateStudent(index: number): Prisma.StudentCreateInput {
  const schoolLevel = randomChoice([SchoolLevel.SHS, SchoolLevel.COLLEGE]);
  const yearLevel =
    schoolLevel === SchoolLevel.SHS
      ? randomChoice([YearLevel.GRADE_11, YearLevel.GRADE_12])
      : randomChoice([
          YearLevel.YEAR_1,
          YearLevel.YEAR_2,
          YearLevel.YEAR_3,
          YearLevel.YEAR_4,
        ]);

  const house = randomChoice(HOUSE_INFO);
  const status =
    Math.random() < 0.9 ? StudentStatus.ACTIVE : StudentStatus.INACTIVE;

  const baseData = {
    id: String(20250000001 + index),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    middleName: Math.random() < 0.7 ? faker.person.firstName() : undefined,
    yearLevel,
    schoolLevel,
    status,
    contactNumber: `09${faker.string.numeric(9)}`,
    house: house.name,
    houseSlug: house.slug,
  };

  const letter = randomChoice(SECTION_LETTERS);

  if (schoolLevel === SchoolLevel.SHS) {
    const strand = randomChoice(STRAND_INFO);
    return {
      ...baseData,
      shsStrand: strand.code,
      section: buildSectionName(strand.code, YEAR_NUMBER[yearLevel], letter),
    };
  }

  // Department follows the program (null for new programs without one)
  const program = randomChoice(COLLEGE_PROGRAMS);
  const dept = departmentBySlug(program.departmentSlug);
  return {
    ...baseData,
    collegeProgram: program.code,
    department: dept?.name ?? null,
    departmentSlug: dept?.slug ?? null,
    section: buildSectionName(program.code, YEAR_NUMBER[yearLevel], letter),
  };
}

// Main seeding function
async function main() {
  console.log("Starting database seed...");

  // Clear existing data
  console.log("Clearing existing data...");
  await prisma.record.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Create users with deterministic credentials for testing
  const defaultPassword = await hashPassword("password");

  const admin = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@gmail.com",
      password: await hashPassword("adminama123"),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const primaryOrganizer = await prisma.user.create({
    data: {
      name: "Campus Organizer",
      email: "organizer@example.com",
      password: defaultPassword,
      role: "ORGANIZER",
      status: "ACTIVE",
    },
  });

  const secondaryOrganizer = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: defaultPassword,
      role: "ORGANIZER",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: defaultPassword,
      role: "ORGANIZER",
      status: "PENDING",
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: defaultPassword,
      role: "ORGANIZER",
      status: "REJECTED",
      rejectionReason: "Missing organization requirements.",
    },
  });

  console.log("Created admin and sample organizers (active/pending/rejected)");

  // Create students first - events derive their SECTION groups from the
  // sections that actually exist on students.
  const studentsData = Array.from({ length: 100 }, (_, i) =>
    generateStudent(i),
  );

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: student,
      create: student,
    });
  }
  console.log(`Created ${studentsData.length} students`);

  const sectionPool = [...new Set(studentsData.map((s) => s.section))];

  // Create events
  const baseDate = new Date("2025-01-01T00:00:00Z");
  const statusCycle: Array<"DRAFT" | "PENDING" | "APPROVED" | "REJECTED"> = [
    "DRAFT",
    "DRAFT",
    "PENDING",
    "APPROVED",
    "APPROVED",
    "REJECTED",
  ];

  const createdEvents: Event[] = [];

  for (let i = 0; i < 18; i++) {
    const baseData = generateEvent(primaryOrganizer.id, baseDate, i, sectionPool);
    const status = statusCycle[i % statusCycle.length];

    let reviewedById: string | null = null;
    let reviewedAt: Date | null = null;
    let rejectionReason: string | null = null;

    if (status === "APPROVED" || status === "REJECTED") {
      reviewedById = admin.id;
      reviewedAt = new Date(baseData.start ?? new Date());
      rejectionReason = status === "REJECTED" ? "Insufficient details." : null;
    }

    const event = await prisma.event.create({
      data: {
        ...baseData,
        status,
        reviewedById,
        reviewedAt,
        rejectionReason,
      },
    });

    createdEvents.push(event);
  }

  console.log(`Created ${createdEvents.length} events`);

  // Create attendance records
  const approvedEvents = createdEvents.filter((e) => e.status === "APPROVED");
  const allStudents = await prisma.student.findMany();
  const methods: AttendanceMethod[] = ["MANUAL", "SCANNED"];

  const recordsData: Prisma.RecordCreateManyInput[] = [];

  for (const event of approvedEvents) {
    const studentsInEvent = allStudents.filter((s) => isStudentInEvent(s, event));
    
    // Each approved event has 40-80% of students attending
    const attendanceRate = 0.4 + Math.random() * 0.4;
    const attendingCount = Math.floor(studentsInEvent.length * attendanceRate);
    const shuffledStudents = [...studentsInEvent].sort(() => Math.random() - 0.5);
    const attendingStudents = shuffledStudents.slice(0, attendingCount);

    for (const student of attendingStudents) {
      const recordDate = new Date(baseDate);
      recordDate.setDate(recordDate.getDate() + Math.random() * 2);
      recordDate.setHours(randomChoice([8, 9, 10, 13, 14, 15]), 0, 0, 0);

      // Every record has a time-in; time-outs (when the event has entered
      // timeout mode) come 1-3 hours later. Mirrors the scan rules: no
      // time-out without a time-in.
      const timeout =
        event.isTimeout && Math.random() < 0.7
          ? new Date(recordDate.getTime() + (1 + Math.random() * 2) * 3600_000)
          : null;

      recordsData.push({
        eventId: event.id,
        studentId: student.id,
        method: randomChoice(methods),
        timein: recordDate,
        timeout,
      });
    }
  }

  await prisma.record.createMany({ data: recordsData });
  console.log(
    `Created ${recordsData.length} attendance records for approved events`,
  );

  console.log("Database seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
