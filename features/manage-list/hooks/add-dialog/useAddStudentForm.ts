"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AddStudentDialogProps,
  StudentFormData,
  StudentFormErrors,
  YearLevelOption,
} from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";
import { DEFAULT_FORM_STATE } from "@/features/manage-list/constants/add-dialog/addStudentConstants";
import {
  prepareStudentSubmitPayload,
  validateStudentData,
} from "@/features/manage-list/utils/add-dialog/validateStudentData";

const YEAR_LEVEL_OPTIONS_SHS: YearLevelOption[] = [
  { label: "Grade 11", value: "GRADE_11" },
  { label: "Grade 12", value: "GRADE_12" },
];

const YEAR_LEVEL_OPTIONS_COLLEGE: YearLevelOption[] = [
  { label: "1st Year", value: "YEAR_1" },
  { label: "2nd Year", value: "YEAR_2" },
  { label: "3rd Year", value: "YEAR_3" },
  { label: "4th Year", value: "YEAR_4" },
];

const mergeWithDefaults = (data?: StudentFormData): StudentFormData => ({
  ...DEFAULT_FORM_STATE,
  ...(data ?? {}),
});

export const useAddStudentForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
  title,
  submitLabel,
}: AddStudentDialogProps) => {
  const [formData, setFormData] = useState<StudentFormData>(DEFAULT_FORM_STATE);
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requireMiddleName, setRequireMiddleName] = useState(true);

  const isEditMode = mode === "edit";
  const dialogTitle = title ?? (isEditMode ? "Edit Student" : "Add Student");
  const submitText = submitLabel ?? (isEditMode ? "Save Changes" : "Add Student");

  const resetForm = useCallback((data?: StudentFormData) => {
    const next = mergeWithDefaults(data);
    setFormData(next);
    setRequireMiddleName(!(next.middleName === "" || next.middleName.toUpperCase() === "N/A"));
    setErrors({});
    setSubmitError(null);
  }, []);

  useEffect(() => {
    if (open) {
      resetForm(initialData);
    }
  }, [open, initialData, resetForm]);

  const yearLevelOptions = useMemo(
    () => (formData.schoolLevel === "SHS" ? YEAR_LEVEL_OPTIONS_SHS : YEAR_LEVEL_OPTIONS_COLLEGE),
    [formData.schoolLevel]
  );

  const handleFieldChange = useCallback(
    (field: keyof StudentFormData, value: string) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value } as StudentFormData;

        if (field === "schoolLevel") {
          if (value === "SHS") {
            next.yearLevel = "GRADE_11";
            next.collegeProgram = "";
          } else {
            next.yearLevel = "YEAR_1";
            next.shsStrand = "";
          }
        }

        if (field === "shsStrand" && prev.schoolLevel !== "SHS") {
          next.shsStrand = "";
        }

        if (field === "collegeProgram" && prev.schoolLevel !== "COLLEGE") {
          next.collegeProgram = "";
        }

        return next;
      });

      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleToggleMiddleName = useCallback(() => {
    setRequireMiddleName((prev) => {
      if (prev) {
        setFormData((current) => ({ ...current, middleName: "" }));
      }
      return !prev;
    });
    setErrors((prev) => ({ ...prev, middleName: undefined }));
  }, []);

  const validate = useCallback(() => {
    const validationErrors = validateStudentData(formData, requireMiddleName);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, requireMiddleName]);

  const handleClose = useCallback(() => {
    resetForm(initialData);
    onClose();
  }, [initialData, onClose, resetForm]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!validate()) {
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        const payload = prepareStudentSubmitPayload(formData, requireMiddleName);
        await onSubmit(payload);
        handleClose();
      } catch (error) {
        console.error("Failed to submit student", error);
        setSubmitError(error instanceof Error ? error.message : "Failed to submit student. Please try again.");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, handleClose, onSubmit, requireMiddleName, validate]
  );

  return {
    formData,
    errors,
    submitError,
    isSubmitting,
    requireMiddleName,
    yearLevelOptions,
    dialogTitle,
    submitText,
    isEditMode,
    setFormData,
    setErrors,
    setSubmitError,
    handleFieldChange,
    handleToggleMiddleName,
    handleSubmit,
    handleClose,
  } as const;
};
