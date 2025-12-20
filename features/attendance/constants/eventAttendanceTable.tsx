import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { FaUserCheck, FaUserClock } from "react-icons/fa6";
import {
  useDeleteRecord,
  useUpdateRecordStatus,
} from "@/globals/hooks/useRecords";
import { AttendanceStatus } from "@prisma/client";
import { FaUserTimes } from "react-icons/fa";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { ArrowUpDown } from "lucide-react";
import { BiSolidTrash } from "react-icons/bi";

function ActionsCell({ row }: { row: any }) {
  const { id: recordId, eventId, studentId } = row.original;
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateRecordStatus(eventId);

  const handleActions = async (status: AttendanceStatus) => {
    try {
      await updateStatus({ recordId, status });
    } catch (error) {
      console.error("Error updating status:", error);
      toastDanger(`Failed to update status for ${studentId}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(recordId);
    } catch (error) {
      console.error("Error deleting record:", error);
      toastDanger(`Failed to delete record for ${studentId}`);
    }
  };

  const isLoading = isDeleting || isUpdating;

  return (
    <div className="flex gap-2 justify-center items-center">
      {[
        {
          type: "PRESENT",
          icon: FaUserCheck,
          color: "text-green-600",
          hover: "hover:bg-green-100",
        },
        {
          type: "EXCUSED",
          icon: FaUserClock,
          color: "text-amber-600",
          hover: "hover:bg-amber-100",
        },
        {
          type: "ABSENT",
          icon: FaUserTimes,
          color: "text-red-600",
          hover: "hover:bg-red-100",
        },
        {
          type: "DELETE",
          icon: BiSolidTrash,
          color: "text-red-500",
          hover: "hover:bg-gray-100",
          handler: handleDelete,
        },
      ].map(({ type, icon: Icon, color, handler }) => (
        <button
          key={type}
          onClick={() =>
            handler ? handler() : handleActions(type as AttendanceStatus)
          }
          disabled={isLoading}
          title={type.charAt(0) + type.slice(1).toLowerCase()}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:scale-110 active:scale-95`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </button>
      ))}
    </div>
  );
}

export const columns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "studentId",
    header: ({ column }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <div className="text-center">
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
      <div className="text-center">{getValue() as string}</div>
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
          School Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
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
      <div className="text-center">{getValue() as string}</div>
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
          Timestamp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    accessorFn: (row) =>
      new Date(row.timestamp).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
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
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
