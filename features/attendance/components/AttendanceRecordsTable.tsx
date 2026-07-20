"use client";

import { getAttendanceColumns } from "@/features/attendance/constants/eventAttendanceTable";
import { Event } from "@/globals/types/events";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import { useMemo } from "react";
import DataTable from "@/globals/components/shared/dataTable/DataTable";
import { useAuth } from "@/globals/contexts/AuthContext";

type Props = {
  selectedEvent: Event | null;
};

const AttendanceRecordsTable = ({ selectedEvent }: Props) => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useAllRecordsFromEvent(
    selectedEvent?.id,
    true
  );
  const records = useMemo(() => data ?? [], [data]);

  // Deleting records requires event ownership (or admin); the columns hide the
  // delete control accordingly so users aren't shown a control that 403s.
  const canManage =
    !!selectedEvent &&
    (user?.role === "ADMIN" || selectedEvent.createdById === user?.id);
  const columns = useMemo(
    () => getAttendanceColumns(canManage),
    [canManage]
  );

  if (!selectedEvent) return null;

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn&apos;t load attendance records. Please retry.
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={records}
      isLoading={isLoading}
      title="Attendance Records"
    />
  );
};

export default AttendanceRecordsTable;
