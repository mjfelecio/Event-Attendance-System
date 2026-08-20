"use client";

import QRCode from "react-qr-code";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/globals/components/shad-cn/dialog";
import { Student } from "@/globals/types/students";

type StudentQrModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | undefined;
};

export function StudentQrModal({
  open,
  onOpenChange,
  student,
}: StudentQrModalProps) {
  if (!student) return null;

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Student QR Code</DialogTitle>
          <DialogDescription>
            Save this code to use for recording your attendance.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* QR Code */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <QRCode
              value={student.id}
              size={220}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          {/* Student Information */}
          <div className="space-y-1 text-center">
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <p className="text-sm text-muted-foreground">
              Student ID: <span className="font-medium">{student.id}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}