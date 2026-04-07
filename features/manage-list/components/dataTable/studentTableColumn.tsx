import { ColumnDef } from "@tanstack/react-table";
import { StudentWithGroups } from "@/globals/types/students";
import {
  useDeleteRecord,
  useUpdateAttendanceRecord,
} from "@/globals/hooks/useRecords";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";
import { useConfirm } from "@/globals/contexts/ConfirmModalContext";
import { formatSection, normalizeName } from "@/globals/utils/formatting";

function ActionsCell({ row }: { row: any }) {
  const { id: recordId, eventId, studentId } = row.original;
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);
  const { mutateAsync: recordAttendance, isPending: isUpdating } =
    useUpdateAttendanceRecord(eventId);
  const confirm = useConfirm();

  const handleRecordAttendance = async () => {
    try {
      await recordAttendance(recordId);
      toastSuccess("Attendance updated");
    } catch (error) {
      toastDanger(`Failed to update: ${studentId}`);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;

    const confirmed = await confirm({
      title: "Mark as absent?",
      description:
        "This removes the student record from this event. This is an irreversable action.",
    });

    if (!confirmed) return;

    try {
      await deleteRecord(recordId);
      toastSuccess("Record removed");
    } catch (error) {
      toastDanger(`Failed to delete: ${studentId}`);
    }
  };

  const isLoading = isDeleting || isUpdating;

  return (
    <div className="flex gap-2 justify-center items-center">
      {[
        {
          id: "present",
          icon: ATTENDANCE_STATUS_ICONS.present,
          color: "text-emerald-600",
          handler: handleRecordAttendance,
          disabled: isLoading,
          title: "Mark as Present",
        },
        {
          id: "absent",
          icon: ATTENDANCE_STATUS_ICONS.absent,
          color: "text-red-400",
          handler: handleDelete,
          disabled: isLoading || !recordId,
          title: "Mark as Absent (Delete Record)",
        },
      ].map(({ id, icon: Icon, color, handler, disabled, title }) => (
        <button
          key={id}
          onClick={handler}
          disabled={disabled}
          title={title}
          className={`flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:scale-110 active:scale-95 ${
            disabled ? "opacity-30 grayscale" : ""
          }`}
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </button>
      ))}
    </div>
  );
}

export const columns: ColumnDef<StudentWithGroups>[] = [
  {
    accessorKey: "id",
    header: () => <div className="text-center">Student ID</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: () => <div className="text-center">Last Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "firstName",
    header: () => <div className="text-center">First Name</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "middleName",
    header: () => <div className="text-center">M.I.</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{(getValue() as string) || "-"}</div>
    ),
  },
  {
    accessorKey: "schoolLevel",
    header: () => <div className="text-center">Level</div>,
    cell: ({ getValue }) => (
      <div className="text-center">
        {normalizeName(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "yearLevel",
    header: () => <div className="text-center">Year / Grade</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {normalizeName(getValue() as string) || "-"}
      </div>
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "department",
    header: () => <div className="text-center">Department</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{normalizeName(getValue() as string) || "-"}</div>
    ),
  },
  {
    accessorKey: "program",
    header: () => <div className="text-center">Program</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "strand",
    header: () => <div className="text-center">Strand</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{(getValue() as string) || "-"}</div>
    ),
  },
  {
    accessorKey: "house",
    header: () => <div className="text-center">House</div>,
    cell: ({ getValue }) => (
      <div className="text-center uppercase">
        {(getValue() as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "section",
    header: () => <div className="text-center">Section</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{formatSection(getValue() as string) || "-"}</div>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
