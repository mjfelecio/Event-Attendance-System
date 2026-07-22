import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { ArrowUpDown } from "lucide-react";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";
import { AttendanceStatus } from "@/globals/types/records";

function StatusCell({ getValue }: { getValue: () => unknown }) {
  const status: AttendanceStatus = getValue() === "absent" ? "absent" : "present";
  const Icon = ATTENDANCE_STATUS_ICONS[status];

  const statusConfig: Record<AttendanceStatus, { color: string; bg: string }> = {
    present: { color: "text-emerald-600", bg: "bg-emerald-50" },
    absent: { color: "text-red-600", bg: "bg-red-50" },
  };

  const config = statusConfig[status];

  return (
    <div className="flex justify-center">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

const formatTime = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "N/A";

export const reportColumns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student ID
          <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center font-medium">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <div className="text-left">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-left font-medium">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "schoolLevel",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-sm">{getValue() as string}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "section",
    // section is a Group object; derive its name so the cell renders a string
    // (not the raw object, which threw React error #31) and sorting compares
    // names instead of object references.
    accessorFn: (row) => row.section?.name ?? "",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Section
          <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-sm">{(getValue() as string) || "N/A"}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "timein",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time in
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) => (row.timein ? new Date(row.timein).getTime() : 0),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="text-center">{formatTime(row.original.timein)}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "timeout",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time out
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) => (row.timeout ? new Date(row.timeout).getTime() : 0),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="text-center">{formatTime(row.original.timeout)}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 print:hidden" />
        </Button>
      </div>
    ),
    cell: StatusCell,
    enableGlobalFilter: false,
  },
];