"use client";

import { getAttendanceColumns } from "@/features/attendance/constants/eventAttendanceTable";
import { Event } from "@/globals/types/events";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import { useMemo } from "react";
import DataTable from "@/globals/components/shared/dataTable/DataTable";
import { DataTableErrorState } from "@/globals/components/shared/dataTable/DataTableStates";
import { useAuth } from "@/globals/contexts/AuthContext";

type Props = {
  selectedEvent: Event | null;
};

const AttendanceRecordsTable = ({ selectedEvent }: Props) => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useAllRecordsFromEvent(
    selectedEvent?.id,
    { live: true }
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

  // Error presentation goes through the shared card (via isError/errorState)
  // rather than a separate red box, so loading/error/empty stay consistent.
  return (
    <DataTable
      columns={columns}
      data={records}
      isLoading={isLoading}
      isError={isError}
      errorState={
        <DataTableErrorState
          title="Couldn't load attendance records"
          description="Please retry."
        />
      }
      title="Attendance Records"
    />
  );
};

export default AttendanceRecordsTable;
