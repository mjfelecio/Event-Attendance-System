"use client";

import { columns } from "@/features/attendance/constants/eventAttendanceTable";
import { Event } from "@/globals/types/events";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import { useMemo } from "react";
import DataTable from "@/globals/components/shared/dataTable/DataTable";

type Props = {
  selectedEvent: Event | null;
};

const AttendanceRecordsTable = ({ selectedEvent }: Props) => {
  const { data, isLoading } = useAllRecordsFromEvent(selectedEvent?.id);
  const records = useMemo(() => data ?? [], [data]);

  if (!selectedEvent) return null;

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
