"use client"

import { Button } from "@/globals/components/shad-cn/button";
import React from "react"
import { IoCameraOutline } from "react-icons/io5";

const studentName = "Juan Dela Cruz"
const studentId = "2025-0001"
const schoolLevel = "COLLEGE"
const collegeProgram = "BS Computer Science"
const yearLevel = "3rd Year"
const section = "CIT-3A"
const contactNumber = "09123456789"
const status = "ACTIVE"

const ScannerSection = () => {
  return (
    <div className="flex gap-4 border-2 border-gray-300 h-[600px] w-full rounded-md p-4">
      {/* Left side = Camera */}
      <div className="flex-2 rounded-md bg-gray-600 flex flex-col items-center justify-center text-white">
				<IoCameraOutline size={320} />
				<p className="text-2xl font-medium">Turn on camera to start attendance</p>
				<Button size={"lg"} variant={"secondary"} className="mt-4 text-xl">
					Open Camera
				</Button>
      </div>

      {/* Right side = Student details */}
      <div className="flex-1 rounded-md bg-gray-50 p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Student Details</h2>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Name:</strong> {studentName}</li>
          <li><strong>Student ID (USN):</strong> {studentId}</li>
          <li><strong>School Level:</strong> {schoolLevel}</li>
          {schoolLevel === "COLLEGE" && (
            <li><strong>Program:</strong> {collegeProgram}</li>
          )}
          <li><strong>Year Level:</strong> {yearLevel}</li>
          <li><strong>Section:</strong> {section}</li>
          <li><strong>Contact:</strong> {contactNumber}</li>
          <li><strong>Status:</strong> {status}</li>
        </ul>
      </div>
    </div>
  )
}

export default ScannerSection
