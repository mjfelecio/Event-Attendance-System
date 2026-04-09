import {
  EventCategory,
  PrismaClient,
  SchoolLevel,
  YearLevel,
  Group,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || ":memory:",
});
const prisma = new PrismaClient({ adapter });

// Utility functions
const randomChoice = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const GROUP_DATA: Record<
  Exclude<EventCategory, "ALL" | "COLLEGE" | "SHS">,
  string[]
> = {
  DEPARTMENT: [
    "Computer Studies",
    "Hotel Management",
    "Business Administration",
  ],
  HOUSE: ["Cahel", "Roxxo", "Giallio", "Azul", "Vierdy"],
  PROGRAM: ["BSCS", "BSIT", "BSHM", "BSBA"],
  YEAR: Object.values(YearLevel),
  SECTION: ["BSCS-2A", "BSIT-2B", "STEM-11A", "STEM-12B"],
  STRAND: ["STEM", "ABM", "HUMSS", "GAS"],
};

async function main() {
  console.log("Seeding database...");

  await prisma.record.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  // Groups
  const allGroups: Group[] = [];
  for (const [category, names] of Object.entries(GROUP_DATA)) {
    for (const name of names) {
      const group = await prisma.group.create({
        data: {
          name,
          slug: slugify(name),
          category: category as EventCategory,
        },
      });
      allGroups.push(group);
    }
  }
  console.log(`Created ${allGroups.length} groups.`);

  // Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      password: "password",
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const organizer = await prisma.user.create({
    data: {
      name: "Organizer",
      email: "organizer@example.com",
      password: "password",
      role: "ORGANIZER",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
      role: "ORGANIZER",
      status: "ACTIVE",
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
      role: "ORGANIZER",
      status: "PENDING",
    },
  });

  await prisma.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password",
      role: "ORGANIZER",
      status: "REJECTED",
      rejectionReason: "Missing organization requirements.",
    },
  });

  // Students
  console.log("Creating students...");
  for (let i = 0; i < 100; i++) {
    const schoolLevel = randomChoice([SchoolLevel.SHS, SchoolLevel.COLLEGE]);
    const yearLevel =
      schoolLevel === SchoolLevel.COLLEGE
        ? randomChoice([
            YearLevel.YEAR_1,
            YearLevel.YEAR_2,
            YearLevel.YEAR_3,
            YearLevel.YEAR_4,
          ])
        : randomChoice([YearLevel.GRADE_11, YearLevel.GRADE_12]);

    // Pick relevant groups for this student
    const studentGroups = [
      randomChoice(allGroups.filter((g) => g.category === "HOUSE")),
      randomChoice(allGroups.filter((g) => g.category === "SECTION")),
    ];

    if (schoolLevel === SchoolLevel.SHS) {
      studentGroups.push(
        randomChoice(allGroups.filter((g) => g.category === "STRAND")),
      );
    } else {
      studentGroups.push(
        randomChoice(allGroups.filter((g) => g.category === "PROGRAM")),
        randomChoice(allGroups.filter((g) => g.category === "DEPARTMENT")),
      );
    }

    const baseId = 20250000000;
    await prisma.student.create({
      data: {
        id: String(baseId + i).padStart(11, "0"),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        schoolLevel,
        yearLevel: yearLevel,
        groups: {
          connect: studentGroups.map((g) => ({ id: g.id })),
        },
      },
    });
  }

  // Events (Linking to groups)
  console.log("Creating events...");
  for (let i = 0; i < 10; i++) {
    const category = randomChoice(Object.values(EventCategory));

    // Pick 1-2 random groups that match the category (if not ALL/COLLEGE/SHS)
    const targetGroups = allGroups
      .filter((g) => g.category === category)
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);

    await prisma.event.create({
      data: {
        title: `${category} Event ${i + 1}`,
        category,
        start: new Date(),
        end: new Date(Date.now() + 3600000),
        status: "APPROVED",
        createdById: organizer.id,
        reviewedById: admin.id,
        includedGroups: {
          connect: targetGroups.map((g) => ({ id: g.id })),
        },
      },
    });
  }

  console.log("Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
