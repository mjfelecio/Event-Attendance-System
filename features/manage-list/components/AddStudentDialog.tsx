"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export type StudentFormMode = "add" | "edit";

export interface StudentFormData {
  id: string;
  lastName: string;
  firstName: string;
  middleName: string;
  schoolLevel: "SHS" | "COLLEGE";
  shsStrand: string;
  collegeProgram: string;
  department: string;
  house: string;
  section: string;
  yearLevel: string;
  status: "ACTIVE" | "INACTIVE" | "GRADUATED" | "DROPPED";
  contactNumber: string;
}

type AddStudentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  initialData?: StudentFormData;
  mode?: StudentFormMode;
  title?: string;
  submitLabel?: string;
};

const departmentOptions = [
  { label: "Select department", value: "" },
  { label: "Computer Studies", value: "Computer Studies" },
  { label: "Business Administration", value: "Business Administration" },
  { label: "Hotel Management", value: "Hotel Management" },
];

const houseOptions = [
  { label: "Select house", value: "" },
  { label: "Giallio", value: "Giallio" },
  { label: "Azul", value: "Azul" },
  { label: "Cahel", value: "Cahel" },
  { label: "Roxxo", value: "Roxxo" },
  { label: "Vierrdy", value: "Vierrdy" },
];

const createDefaultData = (): StudentFormData => ({
  id: "",
  lastName: "",
  firstName: "",
  middleName: "",
  schoolLevel: "COLLEGE",
  shsStrand: "",
  collegeProgram: "",
  department: "",
  house: "",
  section: "",
  yearLevel: "YEAR_1",
  status: "ACTIVE",
  contactNumber: "",
});

const AddStudentDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
  title,
  submitLabel,
}: AddStudentDialogProps) => {
  const [formData, setFormData] = useState<StudentFormData>(createDefaultData);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requireMiddleName, setRequireMiddleName] = useState(true);

  const isEditMode = mode === "edit";
  const dialogTitle = title ?? (isEditMode ? "Edit Student" : "Add Student");
  const submitText = submitLabel ?? (isEditMode ? "Save Changes" : "Add Student");

  const yearLevelOptions = useMemo(() => {
    if (formData.schoolLevel === "SHS") {
      return [
        { label: "Grade 11", value: "GRADE_11" },
        { label: "Grade 12", value: "GRADE_12" },
      ];
    }

    return [
      { label: "1st Year", value: "YEAR_1" },
      { label: "2nd Year", value: "YEAR_2" },
      { label: "3rd Year", value: "YEAR_3" },
      { label: "4th Year", value: "YEAR_4" },
    ];
  }, [formData.schoolLevel]);

  const resetForm = (data?: StudentFormData) => {
    const base = data ? { ...data } : createDefaultData();

    if (base.schoolLevel === "COLLEGE" && !base.collegeProgram) {
      base.collegeProgram = "";
    }

    if (base.schoolLevel === "SHS" && !base.shsStrand) {
      base.shsStrand = "";
    }

    setFormData(base);
    setRequireMiddleName(!(base.middleName === "" || base.middleName.toUpperCase() === "N/A"));
    setErrors({});
    setSubmitError(null);
  };

  useEffect(() => {
    if (open) {
      resetForm(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  if (!open) {
    return null;
  }

  const handleFieldChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

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
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!/^[0-9]{11}$/.test(formData.id)) {
      nextErrors.id = "Student ID must be exactly 11 digits";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required";
    }

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required";
    }

    if (requireMiddleName && !formData.middleName.trim()) {
      nextErrors.middleName = "Middle name is required or mark none";
    }

    if (!formData.section.trim()) {
      nextErrors.section = "Section is required";
    }

    if (formData.schoolLevel === "SHS" && !formData.shsStrand.trim()) {
      nextErrors.shsStrand = "SHS strand is required";
    }

    if (formData.schoolLevel === "COLLEGE" && !formData.collegeProgram.trim()) {
      nextErrors.collegeProgram = "Program is required";
    }

    if (!formData.department.trim()) {
      nextErrors.department = "Department is required";
    }

    if (!formData.house.trim()) {
      nextErrors.house = "House is required";
    }

    if (!formData.contactNumber.trim()) {
      nextErrors.contactNumber = "Contact number is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload: StudentFormData = {
        ...formData,
        middleName: requireMiddleName ? formData.middleName.trim() : "N/A",
        shsStrand:
          formData.schoolLevel === "SHS" ? formData.shsStrand.trim() : "N/A",
        collegeProgram:
          formData.schoolLevel === "COLLEGE" ? formData.collegeProgram.trim() : "N/A",
        department: formData.department.trim(),
        house: formData.house.trim(),
        contactNumber: formData.contactNumber.trim(),
      };

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Failed to submit student", error);
      setSubmitError("Failed to submit student. Please try again.");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-800">{dialogTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="student-id" className="text-sm font-semibold text-neutral-700">
                Student ID (11 digits) <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-id"
                type="text"
                maxLength={11}
                value={formData.id}
                onChange={(event) => {
                  const sanitized = event.target.value.replace(/\D/g, "");
                  handleFieldChange("id", sanitized);
                }}
                disabled={isEditMode || isSubmitting}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., 20241234567"
              />
              {errors.id && <span className="text-xs text-rose-600">{errors.id}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="last-name" className="text-sm font-semibold text-neutral-700">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="last-name"
                type="text"
                value={formData.lastName}
                onChange={(event) => handleFieldChange("lastName", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
              />
              {errors.lastName && <span className="text-xs text-rose-600">{errors.lastName}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="first-name" className="text-sm font-semibold text-neutral-700">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="first-name"
                type="text"
                value={formData.firstName}
                onChange={(event) => handleFieldChange("firstName", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              />
              {errors.firstName && <span className="text-xs text-rose-600">{errors.firstName}</span>}
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="middle-name" className="text-sm font-semibold text-neutral-700">
                  Middle Name {requireMiddleName && <span className="text-rose-500">*</span>}
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                  <input
                    type="checkbox"
                    checked={!requireMiddleName}
                    onChange={() => {
                      setRequireMiddleName((prev) => !prev);
                      if (requireMiddleName) {
                        handleFieldChange("middleName", "");
                      }
                    }}
                    className="size-4 rounded border-neutral-300 text-neutral-800 focus:ring-2 focus:ring-neutral-400/40"
                  />
                  <span>No middle name</span>
                </label>
              </div>
              <input
                id="middle-name"
                type="text"
                value={requireMiddleName ? formData.middleName : ""}
                onChange={(event) => handleFieldChange("middleName", event.target.value)}
                disabled={!requireMiddleName || isSubmitting}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 disabled:bg-neutral-100 disabled:text-neutral-400"
                placeholder={requireMiddleName ? "e.g., Santos" : "N/A"}
              />
              {errors.middleName && <span className="text-xs text-rose-600">{errors.middleName}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="school-level" className="text-sm font-semibold text-neutral-700">
                School Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="school-level"
                value={formData.schoolLevel}
                onChange={(event) => handleFieldChange("schoolLevel", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              >
                <option value="COLLEGE">College</option>
                <option value="SHS">Senior High School</option>
              </select>
            </div>

            {formData.schoolLevel === "SHS" ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="shs-strand" className="text-sm font-semibold text-neutral-700">
                  SHS Strand <span className="text-rose-500">*</span>
                </label>
                <input
                  id="shs-strand"
                  type="text"
                  value={formData.shsStrand}
                  onChange={(event) => handleFieldChange("shsStrand", event.target.value)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                  placeholder="e.g., STEM, HUMSS, ABM"
                />
                {errors.shsStrand && <span className="text-xs text-rose-600">{errors.shsStrand}</span>}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="college-program" className="text-sm font-semibold text-neutral-700">
                  College Program <span className="text-rose-500">*</span>
                </label>
                <input
                  id="college-program"
                  type="text"
                  value={formData.collegeProgram}
                  onChange={(event) => handleFieldChange("collegeProgram", event.target.value)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                  placeholder="e.g., BSCS, BSIT, BSBA"
                />
                {errors.collegeProgram && <span className="text-xs text-rose-600">{errors.collegeProgram}</span>}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="department" className="text-sm font-semibold text-neutral-700">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={(event) => handleFieldChange("department", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              >
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.department && <span className="text-xs text-rose-600">{errors.department}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="house" className="text-sm font-semibold text-neutral-700">
                House <span className="text-rose-500">*</span>
              </label>
              <select
                id="house"
                value={formData.house}
                onChange={(event) => handleFieldChange("house", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              >
                {houseOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.house && <span className="text-xs text-rose-600">{errors.house}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="section" className="text-sm font-semibold text-neutral-700">
                Section <span className="text-rose-500">*</span>
              </label>
              <input
                id="section"
                type="text"
                value={formData.section}
                onChange={(event) => handleFieldChange("section", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
                placeholder="e.g., 1A, 2B"
              />
              {errors.section && <span className="text-xs text-rose-600">{errors.section}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="year-level" className="text-sm font-semibold text-neutral-700">
                Year Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="year-level"
                value={formData.yearLevel}
                onChange={(event) => handleFieldChange("yearLevel", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              >
                {yearLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-semibold text-neutral-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(event) => handleFieldChange("status", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-number" className="text-sm font-semibold text-neutral-700">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="contact-number"
                type="tel"
                value={formData.contactNumber}
                onChange={(event) => handleFieldChange("contactNumber", event.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                disabled={isSubmitting}
                placeholder="e.g., 09171234567"
              />
              {errors.contactNumber && (
                <span className="text-xs text-rose-600">{errors.contactNumber}</span>
              )}
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-rose-600">{submitError}</p>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDialog;
