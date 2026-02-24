import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { useCreateRecord, useDeleteRecord } from "@/globals/hooks/useRecords";
import { toastDanger } from "@/globals/components/shared/toasts";
import { ArrowUpDown } from "lucide-react";
import { ATTENDANCE_STATUS_ICONS } from "./attendanceStatus";
import { NewRecord } from "@/globals/types/records";

function ActionsCell({ row }: { row: any }) {
  const { id: recordId, eventId, studentId } = row.original;
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);
  const { mutateAsync: createRecord, isPending: isUpdating } =
    useCreateRecord(eventId);

  const handleCreate = async () => {
    const payload: NewRecord = {
      eventId: eventId,
      studentId: studentId,
      method: "MANUAL",
    };

    try {
      await createRecord(payload);
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
          icon: ATTENDANCE_STATUS_ICONS.present,
          color: "text-emerald-600",
        },
        {
          type: "ABSENT",
          icon: ATTENDANCE_STATUS_ICONS.absent,
          color: "text-red-400",
        },
        {
          type: "DELETE",
          icon: ATTENDANCE_STATUS_ICONS.delete,
          color: "text-red-500",
          handler: handleDelete,
        },
      ].map(({ type, icon: Icon, color, handler }) => (
        <button
          key={type}
          onClick={() => (handler ? handler() : handleCreate())}
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
    accessorFn: (row) => {
      return row.timein
        ? new Date(row.timein).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        : "N/A";
    },
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
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
    accessorFn: (row) => {
      return row.timeout
        ? new Date(row.timeout).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        : "N/A";
    },
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
    enableGlobalFilter: false,
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <div className="text-center">
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Status
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     </div>
  //   ),
  //   cell: ({ getValue }) => (
  //     <div className="text-center">{getValue() as string}</div>
  //   ),
  //   enableGlobalFilter: false,
  // },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
