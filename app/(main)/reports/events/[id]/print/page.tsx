import { redirect } from "next/navigation";
import PrintableEventReport from "@/features/reports/components/PrintableEventReport";
import { prisma } from "@/globals/libs/prisma";
import { StudentWithRecords } from "@/globals/types/students";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";
import {
  assertEventVisibility,
  getFreshAuthSession,
} from "@/globals/utils/auth";

type PrintPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PrintPage({ params }: PrintPageProps) {
  const { id: eventId } = await params;

  // This report exposes student PII (names, USNs, attendance times). The
  // client layout does not protect a direct request to this server route,
  // so authenticate and enforce event visibility here.
  const user = await getFreshAuthSession();
  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      includedGroups: true,
      createdBy: true,
    },
  });

  if (!event) {
    return <div>Event not found</div>;
  }

  // Organizers may only print reports for events they can see (own or
  // approved); admins may print any.
  assertEventVisibility(event, user);

  const students = await prisma.student.findMany({
    where: { ...buildEventStudentFilter(event) },
    include: { groups: true, records: { where: { eventId } } },
    orderBy: { lastName: "asc" },
  });

  const eligibleCount = students.length;
  const presentCount = students.filter(
    (student) => !!student?.records?.length,
  ).length;

  const groupedStudentsBySection = students.reduce<
    Record<string, StudentWithRecords[]>
  >((acc, student) => {
    const section =
      student.groups.find((g) => g.category === "SECTION")?.name ?? "Ungrouped";

    acc[section] ??= [];
    acc[section].push(student);

    return acc;
  }, {});

  return (
    <PrintableEventReport
      event={event}
      groupedRecords={groupedStudentsBySection ?? null}
      stats={{ eligible: eligibleCount, present: presentCount }}
    />
  );
}
