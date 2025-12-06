import { Button } from "@/globals/components/shad-cn/button";
import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import {
  useDeleteRecord,
  useSaveRecord,
  useUpdateRecordStatus,
} from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { AttendanceStatus } from "@prisma/client";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { FaCheck, FaClock, FaTrash } from "react-icons/fa6";

type AttendanceActionButtonsProps = {
  /** The event ID for which attendance is being recorded */
  eventId: string;
  /** The student ID whose attendance is being managed */
  studentId: string;
  /** Optional existing record ID if the student already has an attendance record */
  recordId?: string;
};

type ActionButtonConfig = {
  status: AttendanceStatus;
  icon: React.ReactNode;
  title: string;
  color: string;
};

const ACTION_BUTTONS: ActionButtonConfig[] = [
  {
    status: "PRESENT",
    icon: <FaCheck />,
    title: "Mark as Present",
    color: "oklch(72.3% 0.219 149.579)", // Green
  },
  {
    status: "EXCUSED",
    icon: <FaClock />,
    title: "Mark as Excused",
    color: "oklch(82.8% 0.189 84.429)", // Yellow
  },
  {
    status: "ABSENT",
    icon: <FaTimes />,
    title: "Mark as Absent",
    color: "red",
  },
];

/**
 * Component that handles attendance record actions
 * 
 * Features:
 * - Creates new attendance records
 * - Updates existing record status
 * - Deletes attendance records
 * 
 * Logic:
 * - If no recordId exists, creates a new record with the selected status
 * - If recordId exists, updates the existing record's status
 * - Delete removes the record entirely
 * 
 * @component
 * 
 * @example
 * ```tsx
 * <AttendanceActionButtons
 *   eventId="event-123"
 *   studentId="student-456"
 *   recordId={existingRecord?.id}
 * />
 * ```
 */
const AttendanceActionButtons = ({
  eventId,
  studentId,
  recordId,
}: AttendanceActionButtonsProps) => {
  const { mutateAsync: createRecord, isPending: isCreating } = useSaveRecord(eventId);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateRecordStatus(eventId);
  const { mutateAsync: deleteRecord, isPending: isDeleting } = useDeleteRecord(eventId);

  /**
   * Handles setting attendance status
   * - Creates new record if none exists
   * - Updates existing record if recordId is provided
   */
  const handleSetStatus = async (status: AttendanceStatus) => {
    try {
      if (!recordId) {
        // No existing record - create new one
        const newRecord: NewRecord = {
          eventId,
          studentId,
          status,
          method: "MANUAL",
        };

        await createRecord(newRecord);
        toastSuccess(`Marked student as ${status.toLowerCase()}`);
      } else {
        // Record exists - update status
        await updateStatus({ recordId, status });
        toastSuccess(`Updated status to ${status.toLowerCase()}`);
      }
    } catch (error) {
      console.error("Error setting attendance status:", error);
      toastWarning(`Failed to set status: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  /**
   * Handles deleting an attendance record
   */
  const handleDelete = async () => {
    if (!recordId) {
      toastWarning("No attendance record to delete");
      return;
    }

    try {
      await deleteRecord(recordId);
      toastSuccess("Attendance record deleted");
    } catch (error) {
      console.error("Error deleting record:", error);
      toastDanger(`Failed to delete record: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <div className="flex gap-1 items-center justify-center">
      {/* Status action buttons */}
      {ACTION_BUTTONS.map(({ status, icon, title, color }) => (
        <Button
          key={status}
          onClick={() => handleSetStatus(status)}
          variant="ghost"
          size="icon"
          title={title}
          disabled={isLoading}
          className="hover:bg-gray-100"
        >
          <span style={{ color }}>{icon}</span>
        </Button>
      ))}

      {/* Delete button */}
      <Button
        onClick={handleDelete}
        variant="ghost"
        size="sm"
        title="Delete Record"
        disabled={isLoading || !recordId}
        className="hover:bg-gray-100"
      >
        <FaTrash className="text-gray-500" />
      </Button>
    </div>
  );
};

export default AttendanceActionButtons;