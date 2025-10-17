"use client";

import React, { useEffect, useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudent } from "@/globals/hooks/useStudents";
import StudentDetails from "@/features/attendance/components/StudentDetails";
import { useSaveRecord } from "@/globals/hooks/useRecords";
import { NewRecord } from "@/globals/types/records";
import { Event } from "@/globals/types/events";

type Props = {
  selectedEvent: Event | null;
};

const ScannerSection = ({ selectedEvent }: Props) => {
  const [scannedValue, setScannedValue] = useState("");
  const { data: studentInfo } = useStudent(scannedValue);
  const { mutate: saveRecord } = useSaveRecord();

  const handleScanResult = (result: string) => {
    setScannedValue(result);
  };

  const recordAttendance = () => {
    // TODO: Differentiate between status based on time or excused
    if (!selectedEvent) {
      console.error("Failed to record attendance: No event selected");
      return;      
    };

    if (!studentInfo || String(studentInfo.id) !== String(scannedValue)) {
      console.error("Found no student with this id: " + scannedValue);
      return;
    }

    const record: NewRecord = {
      eventId: selectedEvent?.id,
      studentId: studentInfo.id,
      status: "PRESENT",
      method: "SCANNED",
    };

    saveRecord(record);
  };

  useEffect(() => {
    if (scannedValue) recordAttendance();
  }, [scannedValue, studentInfo]);

  if (!selectedEvent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-gray-300 w-full rounded-md p-4">
        <h1 className="text-4xl">No Event Selected</h1>
        <h3 className="text-md text-gray-500">Select an event first to start attendance</h3>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] gap-4 border-2 border-gray-300 w-full rounded-md p-4">
      <Scanner onRead={handleScanResult} />
      <StudentDetails data={studentInfo} />
    </div>
  );
};

export default ScannerSection;
