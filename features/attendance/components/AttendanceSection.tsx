"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudentFromEvent } from "@/globals/hooks/useStudents";
import StudentDetails from "@/features/attendance/components/StudentDetails";
import { useCreateRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { Event } from "@/globals/types/events";
import {
  toastDanger,
  toastInfo,
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

const AttendanceSection = ({ selectedEvent }: ScannerSectionProps) => {
  const [scannedValue, setScannedValue] = useState("");
  const prevScannedValRef = useRef("");

  // Fetches a student based on the scanned value (USN or LRN)
  // Returns null when the student doesnt exist, or is not included in the event
  const {
    data: student,
    isError: isStudentFetchingError,
    error: studentFetchError,
    isFetching,
  } = useStudentFromEvent({
    eventId: selectedEvent?.id,
    studentId: scannedValue,
  });

  // Saves a student record once it has been scanned
  const { mutate: createAttendanceRecord, isPending: isSavingRecord } = useCreateRecord(
    selectedEvent?.id || ""
  );

  const handleScanResult = useCallback((result: string) => {
    // TODO: Add validation here to check if its a valid id
    if (!result) {
      toastDanger("Invalid scan result");
      return;
    }

    // Set the scanned value to trigger student fetch
    setScannedValue(result);
  }, []);

  useEffect(() => {
    if (!scannedValue || isFetching) return;
    // If we already created the event using the same scanned value, then just return
    if (prevScannedValRef.current === scannedValue) {
      toastInfo(`This student's attendance is already recorded`);
      return;
    }

    if (studentFetchError) {
      console.error("Error: ", studentFetchError);
    }

    if (isStudentFetchingError || !student) {
      toastDanger(`No student found with ID: ${scannedValue}`);
      setScannedValue("");
      return;
    }

    if (!selectedEvent) {
      toastDanger("Failed to record attendance: No event selected");
      return;
    }

    // Create the record object
    const record: NewRecord = {
      eventId: selectedEvent.id,
      studentId: student.id,
      status: "PRESENT",
      method: "SCANNED",
    };

    // Save the record
    createAttendanceRecord(record, {
      onError: (error) => {
        toastWarning(`Attendance recording failed: ${error.message}`);
        console.error("Record save error:", error);
      },
      onSuccess: () => {
        toastSuccess(
          `Successfully recorded attendance for ${student.firstName} ${student.lastName}`
        );
        // We store this ref as scanned so it doesn't re-save the record for the second time
        // Since it was saved successfully after all
        prevScannedValRef.current = scannedValue;
      },
    });

    setScannedValue("");
  }, [student, isFetching, isStudentFetchingError, selectedEvent]);

  if (!selectedEvent) {
    return <NoEventState />;
  }

  return (
    <div className="flex h-[600px] gap-4 border-2 border-gray-300 w-full rounded-lg p-4 bg-white">
      <Scanner onRead={handleScanResult} isPending={isSavingRecord} />
      <StudentDetails
        selectedEvent={selectedEvent}
        data={student ?? null}
        onSelect={() => {}}
        isFetching={isFetching}
      />
    </div>
  );
};

export default AttendanceSection;
