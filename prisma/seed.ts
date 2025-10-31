import {
  AttendanceMethod,
  AttendanceStatus,
  Prisma,
  PrismaClient,
  SchoolLevel,
  StudentStatus,
  YearLevel,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

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

// Realistic strand and program options
const SHS_STRANDS = ["STEM", "ABM", "HUMSS", "GAS"];
const COLLEGE_PROGRAMS = ["BSCS", "BSIT", "BSHM", "BSBA"];
const SECTIONS = ["A", "B", "C", "D", "E"];
const DEPARTMENTS = [
  "Computer Studies",
  "Hotel Management",
  "Business Administration",
];
const HOUSES = ["Cahel", "Roxxo", "Giallio", "Azul", "Vierdy"];
const EVENT_CATEGORIES = [
  "ALL",
  "COLLEGE",
  "SHS",
  "DEPARTMENT",
  "STRAND",
  "HOUSE",
];

// Generate realistic but varied event data
function generateEvent(organizerId: string, baseDate: Date, index: number) {
  const eventType = randomChoice(EVENT_CATEGORIES);
  const isAllDay = randomChoice([true, false]);

  let startDate = new Date(baseDate);
  startDate.setDate(startDate.getDate() + index * 2); // Spread events across days

  let endDate = new Date(startDate);
  if (isAllDay) {
    endDate.setHours(0, 0, 0, 0);
  } else {
    endDate.setHours(startDate.getHours() + randomChoice([1, 2, 3, 4]));
  }

  const eventTitles: Record<string, string[]> = {
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
  };

  const title = randomChoice(eventTitles[eventType] || eventTitles.ALL);
  const locations = [
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

  return {
    title,
    location: randomChoice(locations),
    description: faker.lorem.sentence(),
    category: eventType,
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    userId: organizerId,
  };
}

// Generate realistic student data
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
  const status = randomChoice([
    StudentStatus.ACTIVE,
    StudentStatus.ACTIVE,
    StudentStatus.INACTIVE,
  ]);

  const baseData = {
    id: String(20250000001 + index),
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    middleName: randomChoice([faker.person.firstName(), undefined]),
    section,
    yearLevel,
    schoolLevel,
    status,
    contactNumber: "0" + faker.phone.number(),
    department,
    departmentSlug: slugify(department) ?? undefined,
    house,
    houseSlug: slugify(house) ?? undefined,
  };

  if (schoolLevel === SchoolLevel.SHS) {
    return {
      ...baseData,
      shsStrand: randomChoice(SHS_STRANDS),
    } as Prisma.StudentCreateInput;
  } else {
    return {
      ...baseData,
      collegeProgram: randomChoice(COLLEGE_PROGRAMS),
    } as Prisma.StudentCreateInput;
  }
}

async function main() {
  console.log("🌱 Starting seed...");

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

  console.log(`✅ Created 2 users (organizer, admin)`);

  // Create 15 varied events
  const baseDate = new Date("2025-09-20T00:00:00Z");
  const eventsData = Array.from({ length: 15 }, (_, i) =>
    generateEvent(organizer.id, baseDate, i)
  );

  await prisma.event.createMany({
    data: eventsData,
  });

  console.log(`✅ Created ${eventsData.length} events`);

  // Create 50 varied students
  const studentsData = Array.from({ length: 50 }, (_, i) => generateStudent(i));

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: student,
      create: student,
    });
  }

  console.log(`✅ Created ${studentsData.length} students`);

  // Fetch all events and students
  const allEvents = await prisma.event.findMany();
  const allStudents = await prisma.student.findMany();

  // Attendance statuses and methods
  const methods: AttendanceMethod[] = ["MANUAL", "SCANNED"];

  // Weighted attendance distribution (more realistic)
  function getRealisticStatus(): AttendanceStatus {
    const rand = Math.random();
    if (rand < 0.75) return "PRESENT";
    if (rand < 0.85) return "LATE";
    if (rand < 0.92) return "EXCUSED";
    return "ABSENT";
  }

  // Generate attendance records with realistic distribution
  const recordsData: Prisma.RecordCreateManyInput[] = [];

  for (const event of allEvents) {
    for (const student of allStudents) {
      if (Math.random() >= 0.3) continue;

      recordsData.push({
        eventId: event.id,
        studentId: student.id,
        status: getRealisticStatus(),
        method: randomChoice(methods),
      });
    }
  }

  await prisma.record.createMany({
    data: recordsData,
  });

  console.log(`✅ Created ${recordsData.length} attendance records`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });