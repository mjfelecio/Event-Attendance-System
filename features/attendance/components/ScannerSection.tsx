"use client";
import React, { useCallback, useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudent } from "@/globals/hooks/useStudents";
import StudentDetails from "@/features/attendance/components/StudentDetails";
import { useSaveRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { Event } from "@/globals/types/events";
import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";

type ScannerSectionProps = {
  selectedEvent: Event | null;
};

/**
 * Empty state when no event is selected
 */
const NoEventState = () => (
  <div className="flex flex-col items-center justify-center h-[600px] border-2 border-gray-300 w-full rounded-lg p-8 bg-gray-50">
    <h1 className="text-4xl font-bold text-gray-800 mb-2">No Event Selected</h1>
    <p className="text-lg text-gray-500">
      Select an event first to start attendance
    </p>
  </div>
);

const ScannerSection = ({ selectedEvent }: ScannerSectionProps) => {
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

      if (!selectedEvent) {
        toastDanger("Failed to record attendance: No event selected");
        return;
      }

      // Set the scanned value to trigger student fetch
      setScannedValue(result);
    },
    [selectedEvent]
  );

  // Effect to handle student data after fetch
  React.useEffect(() => {
    if (!scannedValue || isFetching) return;

    if (isStudentFetchingError || !studentInfo) {
      toastDanger(`No student found with ID: ${scannedValue}`);
      setScannedValue("");
      return;
    }

    const record: NewRecord = {
      eventId: selectedEvent?.id || "",
      studentId: studentInfo.id,
      status: "PRESENT",
      method: "SCANNED",
    };

    saveRecord(record, {
      onError: (error) => {
        toastWarning(`Attendance recording failed: ${error.message}`);
        console.error("Record save error:", error);
        setScannedValue("");
      },
      onSuccess: () => {
        toastSuccess(`Successfully recorded attendance for ${studentInfo.firstName} ${studentInfo.lastName}`);
        setScannedValue("");
      },
    });
  }, [studentInfo, isStudentFetchingError, isFetching, scannedValue]);

  if (!selectedEvent) {
    return <NoEventState />;
  }

  return (
    <div className="flex h-[600px] gap-4 border-2 border-gray-300 w-full rounded-lg p-4 bg-white">
      <Scanner onRead={handleScanResult} isPending={isPending} />
      <StudentDetails
        selectedEvent={selectedEvent}
        data={studentInfo ?? null}
        onSelect={setScannedValue}
        isFetching={isFetching || isPending}
      />
    </div>
  );
};

export default ScannerSection;