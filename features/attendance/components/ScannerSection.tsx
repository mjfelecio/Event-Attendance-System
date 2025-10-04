"use client";

import { Button } from "@/globals/components/shad-cn/button";
import React, { useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import BarcodeScanner from "react-qr-barcode-scanner";
import { BiSolidCameraOff } from "react-icons/bi";
import Scanner from "./Scanner";

const studentName = "Juan Dela Cruz";
const studentId = "2025-0001";
const schoolLevel = "COLLEGE";
const collegeProgram = "BS Computer Science";
const yearLevel = "3rd Year";
const section = "CIT-3A";
const contactNumber = "09123456789";
const status = "ACTIVE";

const ScannerSection = () => {



  return (
    <div className="flex gap-4 border-2 border-gray-300 w-full rounded-md p-4">
      {/* Left side = Camera */}
      <Scanner onRead={(id) => alert("Found this id: " + id)} />
      
      {/* Right side = Student details */}
      <div className="flex-1 rounded-md bg-gray-100 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Student Details</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Name:</strong> {studentName}
          </li>
          <li>
            <strong>Student ID (USN):</strong> {studentId}
          </li>
          <li>
            <strong>School Level:</strong> {schoolLevel}
          </li>
          {schoolLevel === "COLLEGE" && (
            <li>
              <strong>Program:</strong> {collegeProgram}
            </li>
          )}
          <li>
            <strong>Year Level:</strong> {yearLevel}
          </li>
          <li>
            <strong>Section:</strong> {section}
          </li>
          <li>
            <strong>Contact:</strong> {contactNumber}
          </li>
          <li>
            <strong>Status:</strong> {status}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ScannerSection;
