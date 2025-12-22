import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { ArrowUpDown, FileText } from "lucide-react";
import { AttendanceStatus } from "@prisma/client";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";

function ViewRecordCell({ row }: { row: any }) {
  const { id: recordId } = row.original;

  const handleViewRecord = () => {
    // Navigate to printable record page
    window.open(`/reports/record/${recordId}`, '_blank');
  };

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewRecord}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        View
      </Button>
    </div>
  );
}

function StatusCell({ getValue }: { getValue: () => any }) {
  const status = getValue() as AttendanceStatus;
  const Icon = ATTENDANCE_STATUS_ICONS[status] || ATTENDANCE_STATUS_ICONS.PRESENT;
  
  const statusConfig: Record<AttendanceStatus, Record<any, any>> = {
    PRESENT: { color: "text-emerald-600", bg: "bg-emerald-50" },
    EXCUSED: { color: "text-sky-600", bg: "bg-sky-50" },
    ABSENT: { color: "text-red-600", bg: "bg-red-50" },
		LATE: {}
  };

  const config = statusConfig[status] || statusConfig.PRESENT;

  return (
    <div className="flex justify-center">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
        <Icon className={`h-4 w-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-sm">{getValue() as string}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Section
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center text-sm">{getValue() as string}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time Recorded
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) =>
      new Date(row.timestamp).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    cell: ({ getValue }) => (
      <div className="text-center text-sm text-gray-600">
        {getValue() as string}
      </div>
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: StatusCell,
    enableGlobalFilter: false,
  },
  {
    id: "view",
    header: () => <div className="text-center">Details</div>,
    cell: ({ row }) => <ViewRecordCell row={row} />,
    enableSorting: false,
  },
];