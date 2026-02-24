import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import { useDeleteRecord, useCreateRecord } from "@/globals/hooks/useRecords";
import { AttendanceStatus, NewRecord } from "@/globals/types/records";
import React from "react";
import { IconType } from "react-icons/lib";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";

type Props = {
  eventId: string;
  studentId: string;
  recordId?: string;
};

const ACTION_BUTTONS: {
  status: AttendanceStatus;
  icon: IconType;
  title: string;
  color: string;
}[] = [
  {
    status: "present",
    icon: ATTENDANCE_STATUS_ICONS.present,
    title: "Mark as Present",
    color: "text-emerald-600",
  },
  {
    status: "absent",
    icon: ATTENDANCE_STATUS_ICONS.absent,
    title: "Mark as Absent",
    color: "text-red-400",
  },
];

const AttendanceActionButtons = ({ eventId, studentId, recordId }: Props) => {
  const { mutateAsync: createRecord, isPending: isCreating } =
    useCreateRecord(eventId);
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);

  const isLoading = isCreating || isDeleting;

  const handleSetStatus = async (status: AttendanceStatus) => {
    try {
      await createRecord({
        eventId,
        studentId,
        status,
        method: "MANUAL",
      } as NewRecord);

      toastSuccess(`Marked student as ${status.toLowerCase()}`);
    } catch (error) {
      toastWarning(
        `Failed to set record: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  const handleDelete = async () => {
    if (!recordId) {
      toastWarning("No attendance record to delete");
      return;
    }
    try {
      await deleteRecord(recordId);
      toastSuccess("Attendance record deleted");
    } catch (error) {
      toastDanger(
        `Failed to delete record: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <div className="flex gap-1 justify-center items-center">
      {ACTION_BUTTONS.map(({ status, icon: Icon, title, color }) => (
        <button
          key={status}
          onClick={() => handleSetStatus(status)}
          disabled={isLoading}
          title={title}
          className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:scale-110 active:scale-95"
        >
          <Icon className={`w-5 h-5 ${color}`} />
        </button>
      ))}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isLoading || !recordId}
        title="Delete Record"
        className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:scale-110 active:scale-95"
      >
        <ATTENDANCE_STATUS_ICONS.delete className="w-5 h-5 text-red-500" />
      </button>
    </div>
  );
};

export default AttendanceActionButtons;
