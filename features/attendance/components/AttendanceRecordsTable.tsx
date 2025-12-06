"use client";

import { DataTable } from "@/globals/components/shared/DataTable";
import { columns } from "@/features/attendance/constants/table";
import SortButton from "@/features/attendance/components/SortButton";
import FilterButton from "@/features/attendance/components/FilterButton";
import SearchBar from "@/features/attendance/components/SearchBar";
import { useState } from "react";
import { Event } from "@/globals/types/events";
import { useEventAttendanceRecords } from "@/globals/hooks/useRecords";
import ShowUnattendedStudentsToggle from "@/features/attendance/components/ShowUnattendedStudentsToggle";

type Props = {
  selectedEvent: Event | null;
};

const AttendanceRecordsTable = ({ selectedEvent }: Props) => {
  const { data, isLoading } = useEventAttendanceRecords(selectedEvent?.id);
  const [query, setQuery] = useState("");
  const records = data ?? [];

  if (!selectedEvent)
    return (
      <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 w-full rounded-md p-6">
        <h3 className="text-3xl">No Records</h3>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-300 w-full rounded-md px-4 pt-4">
      <div className="flex flex-row justify-between">
        <h3 className="text-3xl font-semibold">Attendance Records</h3>
        <div className="flex flex-row gap-2">
          {/* TODO: Implement the functionality here from the backend */}
          <SearchBar choices={[]} onSelect={() => {}} onQueryChange={setQuery} />
          <SortButton />
          <FilterButton />
        </div>
      </div>
      <ShowUnattendedStudentsToggle />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 w-full rounded-md p-6">
          <h3 className="text-3xl">Loading...</h3>
        </div>
      ) : (
        <DataTable columns={columns} data={records} />
      )}
    </div>
  );
};

export default AttendanceRecordsTable;
