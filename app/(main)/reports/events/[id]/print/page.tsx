import PrintableEventReport, {
  StudentWithRecords,
} from "@/features/reports/components/PrintableEventReport";
import { prisma } from "@/globals/libs/prisma";
import { buildEventStudentFilter } from "@/globals/utils/buildEventStudentFilter";

type PrintPageProps = {
  params: {
    id: string;
  };
};

export default async function PrintPage({ params }: PrintPageProps) {
  const eventId = await params.id;

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
