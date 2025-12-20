"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudentFromEvent } from "@/globals/hooks/useStudents";
import ManualAttendanceSection from "@/features/attendance/components/ManualAttendanceSection";
import { useCreateRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { Event } from "@/globals/types/events";
import {
  toastDanger,
  toastInfo,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";
import { Student } from "@/globals/types/students";

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
  const [displayedStudent, setDisplayedStudent] = useState<Student | null>(
    null
  );
  const [scanSource, setScanSource] = useState<"scan" | "">("");
  const prevScannedValRef = useRef("");

  const {
    data: student,
    isError: isStudentFetchingError,
    error: studentFetchError,
    isFetching,
  } = useStudentFromEvent({
    eventId: selectedEvent?.id,
    studentId: scannedValue,
  });

  const { mutate: createAttendanceRecord, isPending: isSavingRecord } =
    useCreateRecord(selectedEvent?.id || "");

  const handleScanResult = useCallback((result: string) => {
    if (!result) {
      toastDanger("Invalid scan result");
      return;
    }

    setScannedValue(result);
    setScanSource("scan");
  }, []);

  /**
   * Manual selection from details page
   */
  const handleManualSelect = useCallback((student: Student) => {
    setDisplayedStudent(student);
    setScanSource("");
  }, []);

  useEffect(() => {
    if (!scannedValue || isFetching) return;

    if (scanSource !== "scan") return;

    // If fetch failed
    if (studentFetchError) {
      console.error("Student fetch error:", studentFetchError);
    }

    if (isStudentFetchingError || !student) {
      toastDanger(`No student found with ID: ${scannedValue}`);
      setScannedValue("");
      setScanSource("");
      return;
    }

    // Always show the fetched student
    setDisplayedStudent(student);

    // Only save if this came from a scan
    if (scanSource !== "scan") return;

    // Prevent double-saving
    if (prevScannedValRef.current === scannedValue) {
      toastInfo(`This student's attendance is already recorded`);
      setScannedValue("");
      setScanSource("");
      return;
    }

    if (!selectedEvent) {
      toastDanger("Failed to record attendance: No event selected");
      setScannedValue("");
      setScanSource("");
      return;
    }

    const record: NewRecord = {
      eventId: selectedEvent.id,
      studentId: student.id,
      status: "PRESENT",
      method: "SCANNED",
    };

    createAttendanceRecord(record, {
      onError: (error) => {
        if (error.message.includes("already exists")) {
          toastWarning("Student attendance was already recorded");
          return;
        }
        toastWarning(`Attendance recording failed: ${error.message}`);
        console.warn("Record save error:", error);
      },
      onSuccess: () => {
        toastSuccess(
          `Successfully recorded attendance for ${student.firstName} ${student.lastName}`
        );
        prevScannedValRef.current = scannedValue;
      },
    });

    // Reset scan state
    setScannedValue("");
    setScanSource("");
  }, [
    student,
    isFetching,
    isStudentFetchingError,
    studentFetchError,
    scanSource,
    scannedValue,
    selectedEvent,
    createAttendanceRecord,
  ]);

  if (!selectedEvent) {
    return <NoEventState />;
  }

  return (
    <div className="flex h-[600px] gap-4 border-2 border-gray-300 w-full rounded-lg p-4 bg-white">
      <Scanner onRead={handleScanResult} isPending={isSavingRecord} />

      <ManualAttendanceSection
        selectedEvent={selectedEvent}
        displayedStudent={displayedStudent}
        isFetching={isFetching}
        onSelect={handleManualSelect}
      />
    </div>
  );
};

export default AttendanceSection;
