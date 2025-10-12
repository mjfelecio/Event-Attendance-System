"use client";

import React, { useState } from "react";
import Scanner from "@/features/attendance/components/Scanner";
import { useStudent } from "@/globals/hooks/useStudents";
import StudentDetails from "@/features/attendance/components/StudentDetails";

const ScannerSection = () => {
  const [scannedValue, setScannedValue] = useState("");
  const { data: studentInfo } = useStudent(scannedValue);

  return (
    <div className="flex min-h-[400px] gap-4 border-2 border-gray-300 w-full rounded-md p-4">
        <Scanner onRead={setScannedValue} />
        <StudentDetails data={studentInfo} />
    </div>
  );
};

export default ScannerSection;
