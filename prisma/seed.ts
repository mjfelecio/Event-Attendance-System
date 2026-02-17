import {
  AttendanceMethod,
  AttendanceStatus,
  EventCategory,
  Prisma,
  PrismaClient,
  SchoolLevel,
  StudentStatus,
  YearLevel,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

type ComboBoxValue = {
  value: string;
  label: string;
};

export const CATEGORY_GROUPS: Record<EventCategory, ComboBoxValue[]> = {
  ALL: [],
  COLLEGE: [],
  SHS: [],
  DEPARTMENT: [
    { value: "CS", label: "Computer Studies" },
    { value: "HM", label: "Hotel Management" },
    { value: "BA", label: "Business Administration" },
  ],
  HOUSE: [
    { value: "AZUL", label: "Azul" },
    { value: "ROXXO", label: "Roxxo" },
    { value: "CAHEL", label: "Cahel" },
    { value: "GIALLIO", label: "Giallio" },
    { value: "VIERRDY", label: "Vierrdy" },
  ],
  PROGRAM: [
    { value: "BSCS", label: "BSCS" },
    { value: "BSIT", label: "BSIT" },
    { value: "BSHM", label: "BSHM" },
    { value: "WAD", label: "WAD" },
  ],
  YEAR: Object.keys(YearLevel).map((l) => ({
    value: l,
    label: l,
  })),
  SECTION: [
    { value: "BSCS-2A", label: "BSCS-2A" },
    { value: "BSIT-2B", label: "BSIT-2B" },
  ],
  STRAND: [
    { value: "ANIMATION", label: "Animation" },
    { value: "PROGRAMMING", label: "Programming" },
  ],
};

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
const SHS_STRANDS = ["STEM", "ABM", "HUMSS", "GAS"];
const COLLEGE_PROGRAMS = ["BSCS", "BSIT", "BSHM", "BSBA"];
const SECTIONS = ["A", "B", "C", "D", "E"];
const DEPARTMENTS = [
  "Computer Studies",
  "Hotel Management",
  "Business Administration",
];
const HOUSES = ["Cahel", "Roxxo", "Giallio", "Azul", "Vierdy"];
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
function generateEvent(
  organizerId: string,
  baseDate: Date,
  index: number
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
  const includedGroups = CATEGORY_GROUPS[eventType] || [];

  return {
    title,
    location: randomChoice(LOCATIONS),
    description: faker.lorem.sentence(),
    category: eventType,
    includedGroups: JSON.stringify(includedGroups.map((g) => g.value)),
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    userId: organizerId,
  };
}

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

  const section = randomChoice(SECTIONS);
  const department = randomChoice(DEPARTMENTS);
  const house = randomChoice(HOUSES);
  const status =
    Math.random() < 0.9 ? StudentStatus.ACTIVE : StudentStatus.INACTIVE;

  const baseData = {
    id: String(20250000001 + index),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    middleName: Math.random() < 0.7 ? faker.person.firstName() : undefined,
    section,
    yearLevel,
    schoolLevel,
    status,
    contactNumber: `09${faker.string.numeric(9)}`,
    department,
    departmentSlug: slugify(department),
    house,
    houseSlug: slugify(house),
  };

  if (schoolLevel === SchoolLevel.SHS) {
    return {
      ...baseData,
      shsStrand: randomChoice(SHS_STRANDS),
    };
  } else {
    return {
      ...baseData,
      collegeProgram: randomChoice(COLLEGE_PROGRAMS),
    };
  }
}

function getRealisticStatus(): AttendanceStatus {
  const rand = Math.random();
  if (rand < 0.75) return "PRESENT";
  if (rand < 0.85) return "LATE";
  if (rand < 0.92) return "EXCUSED";
  return "ABSENT";
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

  // Create users
  const organizer = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "ORGANIZER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "ADMIN",
    },
  });

  console.log(`Created ${2} users`);

  // Create events
  const baseDate = new Date("2025-01-01T00:00:00Z");
  const eventsData = Array.from({ length: 20 }, (_, i) =>
    generateEvent(organizer.id, baseDate, i)
  );

  await prisma.event.createMany({ data: eventsData });
  console.log(`Created ${eventsData.length} events`);

  // Create students
  const studentsData = Array.from({ length: 100 }, (_, i) =>
    generateStudent(i)
  );

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: student,
      create: student,
    });
  }
  console.log(`Created ${studentsData.length} students`);

  // Create attendance records
  const allEvents = await prisma.event.findMany();
  const allStudents = await prisma.student.findMany();
  const methods: AttendanceMethod[] = ["MANUAL", "SCANNED"];

  const recordsData: Prisma.RecordCreateManyInput[] = [];

  for (const event of allEvents) {
    // Each event has 40-80% of students attending
    const attendanceRate = 0.4 + Math.random() * 0.4;
    const attendingCount = Math.floor(allStudents.length * attendanceRate);
    const shuffledStudents = [...allStudents].sort(() => Math.random() - 0.5);
    const attendingStudents = shuffledStudents.slice(0, attendingCount);

    for (const student of attendingStudents) {
      recordsData.push({
        eventId: event.id,
        studentId: student.id,
        status: getRealisticStatus(),
        method: randomChoice(methods),
      });
    }
  }

  await prisma.record.createMany({ data: recordsData });
  console.log(`Created ${recordsData.length} attendance records`);

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
