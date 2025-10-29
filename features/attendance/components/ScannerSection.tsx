"use client";

import React, { useCallback, useEffect, useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudent } from "@/globals/hooks/useStudents";
import StudentDetails from "@/features/attendance/components/StudentDetails";
import { useSaveRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { Event } from "@/globals/types/events";
import { toast } from "sonner";
import {
  toastDanger,
  toastInfo,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";

type Props = {
  selectedEvent: Event | null;
};

const ScannerSection = ({ selectedEvent }: Props) => {
  const [scannedValue, setScannedValue] = useState("");
  const {
    data: studentInfo,
    isError: isStudentFetchingError,
    isFetching,
  } = useStudent(scannedValue);
  const { mutate: saveRecord, isPending } = useSaveRecord(
    selectedEvent?.id || ""
  );

  const handleScanResult = useCallback(
    (result: string) => {
      if (!result) {
        toastDanger("Invalid scan result");
        return;
      }

      setScannedValue(result);

      if (!selectedEvent) {
        toastDanger("Failed to record attendance: No event selected");
        return;
      }

      try {
        if (!isStudentFetchingError && !isFetching) {
          toastDanger(`No student found with ID: ${result}`);
          return;
        }

        if (!studentInfo) {
          return;
        }

        const record: NewRecord = {
          eventId: selectedEvent?.id,
          studentId: studentInfo.id,
          status: "PRESENT",
          method: "SCANNED",
        };

        saveRecord(record, {
          onError: (error) => {
            toastWarning(`Attendance recording failed: ${error.message}`);
            console.error("Record save error:", error);
          },
          onSuccess: () => {
            toastSuccess(`Successfully recorded attendance for ${result}`);
            setScannedValue("");
          },
        });
      } catch (error) {
        toastDanger("Unexpected error during scanning");
        console.error(error);
      }
    },
    [scannedValue]
  );

  if (!selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-gray-300 w-full rounded-md p-4">
        <h1 className="text-4xl">No Event Selected</h1>
        <h3 className="text-md text-gray-500">
          Select an event first to start attendance
        </h3>
      </div>
    );
  }

  if (isPending) {
    <div>
      <h1 className="text-4xl">Trying to create record</h1>
    </div>;
  }

  return (
    <div className="flex min-h-[400px] gap-4 border-2 border-gray-300 w-full rounded-md p-4">
      <Scanner onRead={handleScanResult} />
      <StudentDetails data={studentInfo} />
    </div>
  );
};

export default ScannerSection;
