import { ColumnDef } from "@tanstack/react-table";
import { Student, StudentAttendanceRecord } from "@/globals/types/students";

export const columns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "id",
    header: "Student ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "schoolLevel",
    header: "School Level",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    accessorFn: (row) => {
      return new Date(row.timestamp).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    },
    cell: ({ getValue }) => {
      const timeStamp = getValue() as string;
      return timeStamp;
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];
