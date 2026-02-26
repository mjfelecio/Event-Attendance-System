import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import { useDeleteRecord, useCreateRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import React from "react";
import { IconType } from "react-icons/lib";
import { ATTENDANCE_STATUS_ICONS } from "@/features/attendance/constants/attendanceStatus";
import { Button } from "@/globals/components/shad-cn/button";
import { capitalize } from "lodash";

type Props = {
  eventId: string;
  studentId: string;
  recordId?: string;
};

const ACTION_BUTTONS: {
  action: "present" | "absent";
  icon: IconType;
  title: string;
  color: string;
}[] = [
  {
    action: "present",
    icon: ATTENDANCE_STATUS_ICONS.present,
    title: "Mark as Present",
    color: "text-emerald-600",
  },
  {
    action: "absent",
    icon: ATTENDANCE_STATUS_ICONS.absent,
    title: "Mark as Absent (Delete Record)",
    color: "text-red-400",
  },
];

const AttendanceActionButtons = ({ eventId, studentId, recordId }: Props) => {
  const { mutateAsync: createRecord, isPending: isCreating } =
    useCreateRecord(eventId);
  const { mutateAsync: deleteRecord, isPending: isDeleting } =
    useDeleteRecord(eventId);

  const isLoading = isCreating || isDeleting;

  const handleAction = async (action: "present" | "absent") => {
    if (action === "present") {
      try {
        await createRecord({
          eventId,
          studentId,
          method: "MANUAL",
        } as NewRecord);

        if (!recordId) {
          toastSuccess("Student marked as present");
        } else {
          toastSuccess("Updated student record");
        }
      } catch (error) {
        toastWarning(
          `Failed to set record: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    } else {
      // Absent action = Delete
      if (!recordId) return; // Already absent
      try {
        await deleteRecord(recordId);
        toastSuccess("Attendance record removed");
      } catch (error) {
        toastDanger(
          `Failed to delete: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      {ACTION_BUTTONS.map(({ action, icon: Icon, title, color }) => {
        // Disable "absent" button if there's no record to delete
        const isDisabled = isLoading || (action === "absent" && !recordId);

        return (
          <Button
            key={action}
            onClick={() => handleAction(action)}
            disabled={isDisabled}
            variant={"outline"}
            title={title}
            className={`${color} flex items-center justify-center text-xs rounded-full transition-colors hover:scale-110 active:scale-95 ${
              isDisabled ? "opacity-30 grayscale" : ""
            }`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
            {capitalize(action)}
          </Button>
        );
      })}
    </div>
  );
};

export default AttendanceActionButtons;
