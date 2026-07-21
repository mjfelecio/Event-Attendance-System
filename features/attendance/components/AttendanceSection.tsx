"use client";

import { useCallback, useState } from "react";

import Scanner from "@/features/attendance/components/Scanner";
import ManualAttendanceSection from "@/features/attendance/components/ManualAttendanceSection";

import {
  toastDanger,
  toastSuccess,
  toastWarning,
} from "@/globals/components/shared/toasts";

import { useCreateRecord } from "@/globals/hooks/useRecords";
import { useStudentFromEvent } from "@/globals/hooks/useStudents";

import { Event } from "@/globals/types/events";
import { NewRecord } from "@/globals/types/records";
import { Student } from "@/globals/types/students";
import { fetchApi } from "@/globals/utils/api";

type Props = {
  selectedEvent: Event | null;
};

export default function AttendanceSection({ selectedEvent }: Props) {
  const [displayedStudent, setDisplayedStudent] = useState<Student | null>(
    null,
  );

  const { mutateAsync: createRecord, isPending: isSavingRecord } =
    useCreateRecord(selectedEvent?.id ?? "");

  /**
   * MANUAL FLOW
   */
  const handleManualSelect = useCallback((student: Student) => {
    setDisplayedStudent(student);
  }, []);

  const processScan = useCallback(
    async (studentId: string) => {
      if (!selectedEvent) {
        toastDanger("No event selected.");
        return;
      }

      try {
        const student = await fetchApi<Student>(
          `/api/students?eventId=${selectedEvent.id}&studentId=${studentId}`,
        );

        if (!student) {
          toastDanger(`No student found with ID: ${studentId}`);
          return;
        }

        setDisplayedStudent(student);

        await createRecord({
          eventId: selectedEvent.id,
          studentId,
          method: "SCANNED",
        });

        toastSuccess("Attendance recorded");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (message.toLowerCase().includes("already exists")) {
          toastWarning("Student attendance was already recorded.");
        } else {
          toastWarning(`Attendance failed: ${message}`);
        }
      }
    },
    [selectedEvent, createRecord],
  );

  /**
   * Scanner entry point
   */
  const handleScan = useCallback(
    (value: string) => {
      processScan(value);
    },
    [processScan],
  );

  if (!selectedEvent) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-lg border p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          No Event Selected
        </h1>
        <p className="text-lg text-gray-500">
          Select an event first to start attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-full gap-4 rounded-lg border bg-white p-4 shadow-sm">
      <Scanner onRead={handleScan} isPending={isSavingRecord} />

      <ManualAttendanceSection
        selectedEvent={selectedEvent}
        displayedStudent={displayedStudent}
        isFetching={false}
        onSelect={handleManualSelect}
      />
    </div>
  );
}
