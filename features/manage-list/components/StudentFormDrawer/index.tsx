import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/globals/components/shad-cn/sheet";
import { Button } from "@/globals/components/shad-cn/button";
import { StudentWithGroups } from "@/globals/types/students";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";
import StepIndicator from "./StepIndicator";
import PersonalInfoSection from "./PersonalInfoSection";
import AcademicSection from "./AcademicSection";
import GroupsSection from "./GroupsSection";

interface Props {
  student?: StudentWithGroups | null;
  isOpen: boolean;
  onClose: () => void;
}

export type Step = "personal" | "academic" | "groups";

export default function StudentFormDrawer({ student, isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>("personal");

  const isEdit = !!student;

  const handleClose = () => {
    setStep("personal");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-md border-l-slate-200 bg-white p-0">
        {/* HEADER */}
        <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
          <SheetTitle className="text-xl font-bold text-slate-800">
            {isEdit ? "Edit Student Profile" : "Register New Student"}
          </SheetTitle>
          <div className="flex items-center gap-2 mt-2">
            <StepIndicator current={step} />
          </div>
        </SheetHeader>

        {/* SCROLLABLE FORM AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {step === "personal" && <PersonalInfoSection student={student} />}
          {step === "academic" && <AcademicSection student={student} />}
          {step === "groups" && <GroupsSection student={student} />}
        </div>

        {/* FOOTER ACTIONS */}
        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between sm:justify-between">
          <div className="flex gap-2 w-full">
            {step !== "personal" && (
              <Button
                variant="outline"
                onClick={() => setStep(step === "groups" ? "academic" : "personal")}
                className="flex-1 rounded-xl border-slate-200 font-bold uppercase tracking-wider text-[10px]"
              >
                <ChevronLeft className="mr-1 size-3" /> Back
              </Button>
            )}

            {step !== "groups" ? (
              <Button
                onClick={() => setStep(step === "personal" ? "academic" : "groups")}
                className="flex-1 bg-slate-900 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-800"
              >
                Next <ChevronRight className="ml-1 size-3" />
              </Button>
            ) : (
              <Button className="flex-1 bg-emerald-600 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-emerald-700">
                <Save className="mr-1 size-3" /> Save Changes
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}




