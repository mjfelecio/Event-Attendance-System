"use client";

import { useCallback, useEffect, useState } from "react";

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
import { surface } from "@/globals/constants/designTokens";
import { cn } from "@/globals/libs/shad-cn";

type Props = {
  selectedEvent: Event | null;
};

export default function AttendanceSection({ selectedEvent }: Props) {
  const [displayedStudent, setDisplayedStudent] = useState<Student | null>(
    null,
  );

  const { mutateAsync: createRecord, isPending: isSavingRecord } =
    useCreateRecord(selectedEvent?.id ?? "");

  // Clear the displayed student when the event changes, so a student from the
  // previous event can't linger (and be acted on) under a different event.
  const selectedEventId = selectedEvent?.id;
  useEffect(() => {
    setDisplayedStudent(null);
  }, [selectedEventId]);

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

        const result = await createRecord({
          eventId: selectedEvent.id,
          studentId,
          method: "SCANNED",
        });

        if (result.changed) {
          toastSuccess(
            selectedEvent.isTimeout ? "Time-out recorded" : "Attendance recorded",
          );
        } else {
          toastWarning(
            selectedEvent.isTimeout
              ? "Student was already timed out."
              : "Student attendance was already recorded.",
          );
        }
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
      <div
        className={cn(
          surface.card,
          "flex min-h-[320px] w-full flex-col items-center justify-center gap-2 p-8 text-center"
        )}
      >
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          No Event Selected
        </h2>
        <p className="text-base text-slate-500">
          Select an event first to start attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-3 lg:grid-cols-[1fr_1.2fr]">
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
