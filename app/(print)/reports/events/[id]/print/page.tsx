import { redirect } from "next/navigation";

import { prisma } from "@/globals/libs/prisma";
import { getFreshAuthSession } from "@/globals/utils/auth";
import {
  REPORT_EVENT_INCLUDE,
  buildEventReport,
} from "@/globals/utils/eventReport";
import AttendanceSheet, {
  type SheetOptions,
} from "@/features/reports/components/print/AttendanceSheet";
import PrintOptionsBar from "@/features/reports/components/print/PrintOptionsBar";

type PrintPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Options default to on; only an explicit "0" turns one off. */
const isEnabled = (value: string | string[] | undefined): boolean =>
  value !== "0";

export default async function PrintPage({
  params,
  searchParams,
}: PrintPageProps) {
  const { id: eventId } = await params;
  const query = await searchParams;

  // This report exposes student PII (names, student numbers, attendance times).
  // The client `(main)` layout never protected a direct request to a server
  // route, and this page no longer sits under it at all — so authenticate and
  // enforce event visibility here.
  const user = await getFreshAuthSession();
  if (!user || user.status !== "ACTIVE") {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: REPORT_EVENT_INCLUDE,
  });

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-600">Event not found.</div>
    );
  }

  // Mirrors `assertEventVisibility`: admins see everything, organizers see their
  // own events plus anything approved. Rendered as a message rather than thrown,
  // because this is a page and not an API route with an error handler.
  const canView =
    user.role === "ADMIN" ||
    event.createdById === user.id ||
    event.status === "APPROVED";

  if (!canView) {
    return (
      <div className="p-8 text-center text-gray-600">
        You do not have access to this report.
      </div>
    );
  }

  // The same builder the on-screen report uses. This page used to query Prisma
  // and recompute eligibility and totals itself, which is how the screen and the
  // printout could disagree.
  const report = await buildEventReport(event);

  const options: SheetOptions = {
    includeAbsentees: isEnabled(query.absentees),
    groupBySection: isEnabled(query.grouped),
    includeSignature: isEnabled(query.signature),
  };

  return (
    <>
      <PrintOptionsBar />
      <AttendanceSheet report={report} options={options} />
    </>
  );
}
