"use client";

import { useFormContext } from "react-hook-form";
import FormInput from "@/globals/components/shared/FormInput";
import { FieldGroup, FieldSet } from "@/globals/components/shad-cn/field";
import SectionHeading from "./SectionHeading";
import { StudentFormValues } from "@/features/auth/schema/studentSchema";

const GroupsSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<StudentFormValues>();

  // Watch schoolLevel to determine which fields to show
  const schoolLevel = watch("schoolLevel");

  return (
    <FieldSet className="animate-in fade-in slide-in-from-right-4 duration-300">
      <SectionHeading
        title="Group Assignments"
        description="Specify the student's group, section, and specific track"
      />

      <FieldGroup className="grid grid-cols-1 gap-y-4">
        {/* Universal Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Section"
            placeholder="e.g. 2A"
            {...register("section")}
            error={errors.section?.message}
          />
          <FormInput
            label="House"
            placeholder="e.g. Phoenix"
            {...register("house")}
            error={errors.house?.message}
          />
        </div>

        {/* Conditional College Fields */}
        {schoolLevel === "COLLEGE" && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
            <FormInput
              label="Department"
              placeholder="e.g. College of Computer Studies"
              {...register("department")}
              error={errors.department?.message}
            />
            <FormInput
              label="Program"
              placeholder="e.g. BS in Computer Science"
              {...register("program")}
              error={errors.program?.message}
            />
          </div>
        )}

        {/* Conditional SHS Fields */}
        {schoolLevel === "SHS" && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <FormInput
              label="Strand"
              placeholder="e.g. STEM"
              {...register("strand")}
              error={errors.strand?.message}
            />
          </div>
        )}
      </FieldGroup>
    </FieldSet>
  );
};

export default GroupsSection;