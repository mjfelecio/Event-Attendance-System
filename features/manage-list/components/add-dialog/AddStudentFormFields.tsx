import { ChangeEvent } from "react";

import { DEPARTMENT_OPTIONS, HOUSE_OPTIONS } from "@/features/manage-list/constants/add-dialog/addStudentConstants";
import { StudentFormData, StudentFormErrors, YearLevelOption } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";

type AddStudentFormFieldsProps = {
  formData: StudentFormData;
  errors: StudentFormErrors;
  isSubmitting: boolean;
  requireMiddleName: boolean;
  yearLevelOptions: YearLevelOption[];
  onFieldChange: (field: keyof StudentFormData, value: string) => void;
  onToggleMiddleName: () => void;
  isEditMode: boolean;
};

const AddStudentFormFields = ({
  formData,
  errors,
  isSubmitting,
  requireMiddleName,
  yearLevelOptions,
  onFieldChange,
  onToggleMiddleName,
  isEditMode,
}: AddStudentFormFieldsProps) => {
  const handleInputChange = (field: keyof StudentFormData) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFieldChange(field, event.target.value);
  };

  return (
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
            onFieldChange("id", sanitized);
          }}
          disabled={isSubmitting || isEditMode}
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
          onChange={handleInputChange("lastName")}
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
          onChange={handleInputChange("firstName")}
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
              onChange={onToggleMiddleName}
              className="size-4 rounded border-neutral-300 text-neutral-800 focus:ring-2 focus:ring-neutral-400/40"
            />
            <span>No middle name</span>
          </label>
        </div>
        <input
          id="middle-name"
          type="text"
          value={requireMiddleName ? formData.middleName : ""}
          onChange={handleInputChange("middleName")}
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
          onChange={handleInputChange("schoolLevel")}
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
            onChange={handleInputChange("shsStrand")}
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
            onChange={handleInputChange("collegeProgram")}
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
          onChange={handleInputChange("department")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
          disabled={isSubmitting}
        >
          {DEPARTMENT_OPTIONS.map((option) => (
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
          onChange={handleInputChange("house")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
          disabled={isSubmitting}
        >
          {HOUSE_OPTIONS.map((option) => (
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
          onChange={handleInputChange("section")}
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
          onChange={handleInputChange("yearLevel")}
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
          onChange={handleInputChange("status")}
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
          onChange={handleInputChange("contactNumber")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
          disabled={isSubmitting}
          placeholder="e.g., 09171234567"
        />
        {errors.contactNumber && (
          <span className="text-xs text-rose-600">{errors.contactNumber}</span>
        )}
      </div>
    </div>
  );
};

export default AddStudentFormFields;
