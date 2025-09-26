import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.createMany({
    data: [
      {
        title: "Programmers Guild Meeting",
        location: "Room 204, CS Building",
        description: "Monthly guild meetup to discuss projects and share knowledge",
        category: "Meeting",
        start: new Date("2025-09-27T20:00:00Z"),
        end: new Date("2025-09-27T21:00:00Z"),
        allDay: false,
      },
      {
        title: "Paytaca Cashscript Workshop",
        location: "Innovation Lab",
        description: "Two-day hands-on workshop on Cashscript development",
        category: "Workshop",
        start: new Date("2025-10-01T00:00:00Z"),
        end: new Date("2025-10-02T00:00:00Z"),
        allDay: true,
      },
      {
        title: "Orientation Day",
        location: "Auditorium",
        description: "Kickoff event for new students",
        category: "School",
        start: new Date("2025-10-03T09:00:00Z"),
        end: new Date("2025-10-03T12:00:00Z"),
        allDay: false,
      },
      {
        title: "Hackathon 2025",
        location: "Tech Hub",
        description: "24-hour coding event",
        category: "Competition",
        start: new Date("2025-10-05T10:00:00Z"),
        end: new Date("2025-10-06T10:00:00Z"),
        allDay: false,
      },
      {
        title: "Founders’ Day",
        location: "Main Campus Grounds",
        description: "Annual celebration with activities, food stalls, and concerts",
        category: "Holiday",
        start: new Date("2025-12-15T00:00:00Z"),
        end: new Date("2025-12-15T00:00:00Z"),
        allDay: true,
      },
    ],
  });

  console.log("✅ Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
