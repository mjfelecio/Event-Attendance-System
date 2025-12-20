"use client";

import DataTable from "@/globals/components/shared/DataTable";
import { columns } from "@/features/attendance/constants/eventAttendanceTable";
import SortButton from "@/features/attendance/components/SortButton";
import FilterButton from "@/features/attendance/components/FilterButton";
import { Event } from "@/globals/types/events";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import ShowUnattendedStudentsToggle from "@/features/attendance/components/ShowUnattendedStudentsToggle";
import { useDataTable } from "@/globals/hooks/useDataTable";
import { DataTableSearch } from "@/globals/components/shared/DataTableSearch";
import { useMemo } from "react";

type Props = {
  selectedEvent: Event | null;
};

const AttendanceRecordsTable = ({ selectedEvent }: Props) => {
  const { data, isLoading } = useAllRecordsFromEvent(selectedEvent?.id);

  const records = useMemo(() => data ?? [], [data]);

  const table = useDataTable(records, columns);

  if (!selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 w-full rounded-md p-6">
        <h3 className="text-3xl">No Records</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-300 w-full rounded-md p-4">
      <div className="flex flex-row justify-between">
        <h3 className="text-3xl font-semibold">Attendance Records</h3>
        <div className="flex flex-row gap-2">
          <DataTableSearch table={table} />
          {/* <SortButton /> */}
          {/* <FilterButton /> */}
        </div>
      </div>
      {/* <ShowUnattendedStudentsToggle /> */}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 w-full rounded-md p-6">
          <h3 className="text-3xl">Loading...</h3>
        </div>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
};

export default AttendanceRecordsTable;
