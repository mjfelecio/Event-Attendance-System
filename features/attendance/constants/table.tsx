import { ColumnDef } from "@tanstack/react-table";
import { StudentAttendanceRecord } from "@/globals/types/students";
import { Button } from "@/globals/components/shad-cn/button";
import { FaCheck, FaClock, FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import {
  useDeleteRecord,
  useUpdateRecordStatus,
} from "@/globals/hooks/useRecords";
import { AttendanceStatus } from "@prisma/client";
import { FaTimes } from "react-icons/fa";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";

 function ActionsCell({ row }: { row: any }) {
  const { id: recordId, eventId, studentId } = row.original;
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateRecordStatus(eventId);

  const handleActions = async (status: AttendanceStatus) => {
    try {
      await updateStatus({ recordId, status });
      toastSuccess(`${status}: ${studentId}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toastDanger(`Failed to update status for ${studentId}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(recordId);
      toastSuccess(`Deleted ${studentId}`);
    } catch (error) {
      console.error("Error deleting record:", error);
      toastDanger(`Failed to delete record for ${studentId}`);
    }
  };

  const isLoading = isDeleting || isUpdating;

  return (
    <div className="flex gap-1 items-center justify-center">
      <Button
        onClick={() => handleActions("PRESENT")}
        variant="ghost"
        size="sm"
        title="Present"
        disabled={isLoading}
      >
        <FaCheck color="oklch(72.3% 0.219 149.579)" />
      </Button>
      <Button
        onClick={() => handleActions("EXCUSED")}
        variant="ghost"
        size="sm"
        title="Excuse"
        disabled={isLoading}
      >
        <FaClock color="oklch(82.8% 0.189 84.429)" />
      </Button>
      <Button
        onClick={() => handleActions("ABSENT")}
        variant="ghost"
        size="sm"
        title="Absent"
        disabled={isLoading}
      >
        <FaTimes color="red" />
      </Button>
      <Button
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        title="Clear"
        disabled={isLoading}
      >
        <FaTrash color="gray" />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<StudentAttendanceRecord>[] = [
  {
    accessorKey: "studentId",
    header: () => <div className="text-center">Student ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: () => <div className="text-center">Full Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "schoolLevel",
    header: () => <div className="text-center">School Level</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "section",
    header: () => <div className="text-center">Section</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: () => <div className="text-center">Timestamp</div>,
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
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];