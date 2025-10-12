"use client";

import { DataTable } from "@/globals/components/shared/DataTable";
import useStudents from "@/globals/hooks/useStudents";
import { columns } from "../constants/table";

const AttendanceTable = () => {
  const { data } = useStudents();
  const records = data ?? [];

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-300 h-[600px] w-full rounded-md p-4">
      <div className="text-3xl font-semibold">Attendance Records</div>
      <div className="gap-4 border-2 border-gray-300 w-full rounded-md">
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default AttendanceTable;
