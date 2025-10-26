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
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell({ row }) {
      const { id: recordId, eventId, studentId } = row.original;
      const { mutate: deleteRecord } = useDeleteRecord(eventId);
      const { mutate: updateStatus } = useUpdateRecordStatus(eventId);

      const handleActions = async (status: AttendanceStatus) => {
        try {
          updateStatus({ recordId, status });
          toast.success(
            <p>
              {status}: {studentId}
            </p>,
            { position: "top-right" }
          );
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };

      const handleDelete = async () => {
        deleteRecord(recordId);
        toast.success(<p>Deleted {studentId}</p>, { position: "top-right" });
      };

      return (
        <div className="flex gap-1 items-center justify-center">
          <Button
            onClick={() => handleActions("PRESENT")}
            variant="ghost"
            size="sm"
            title="Present"
          >
            <FaCheck color="oklch(72.3% 0.219 149.579)" />
          </Button>
          <Button
            onClick={() => handleActions("EXCUSED")}
            variant="ghost"
            size="sm"
            title="Excuse"
          >
            <FaClock color="oklch(82.8% 0.189 84.429)" />
          </Button>
          <Button
            onClick={() => handleActions("ABSENT")}
            variant="ghost"
            size="sm"
            title="Absent"
          >
            <FaTimes color="red" />
          </Button>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            title="Clear"
          >
            <FaTrash color="gray" />
          </Button>
        </div>
      );
    },
  },
];
