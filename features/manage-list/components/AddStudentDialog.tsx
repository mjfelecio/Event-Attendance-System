'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddStudentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
}

export interface StudentFormData {
  id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  schoolLevel: 'SHS' | 'COLLEGE';
  shsStrand?: string;
  collegeProgram?: string;
  section: string;
  yearLevel: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'DROPPED';
  contactNumber?: string;
}

const AddStudentDialog = ({ open, onClose, onSubmit }: AddStudentDialogProps) => {
  const [formData, setFormData] = useState<StudentFormData>({
    id: '',
    lastName: '',
    firstName: '',
    middleName: '',
    schoolLevel: 'COLLEGE',
    section: '',
    yearLevel: 'YEAR_1',
    status: 'ACTIVE',
  });

  const [hasMiddleName, setHasMiddleName] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});

  if (!open) return null;

  const handleChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Clear conditional fields when schoolLevel changes
      if (field === 'schoolLevel') {
        if (value === 'SHS') {
          updated.collegeProgram = undefined;
          updated.yearLevel = 'GRADE_11';
        } else {
          updated.shsStrand = undefined;
          updated.yearLevel = 'YEAR_1';
        }
      }
      
      return updated;
    });
    
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};

    if (!formData.id || formData.id.length !== 11 || !/^\d{11}$/.test(formData.id)) {
      newErrors.id = 'Student ID must be exactly 11 digits';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (hasMiddleName && !formData.middleName?.trim()) {
      newErrors.middleName = 'Middle name is required or uncheck the option';
    }
    if (!formData.section.trim()) {
      newErrors.section = 'Section is required';
    }
    if (formData.schoolLevel === 'SHS' && !formData.shsStrand?.trim()) {
      newErrors.shsStrand = 'SHS Strand is required';
    }
    if (formData.schoolLevel === 'COLLEGE' && !formData.collegeProgram?.trim()) {
      newErrors.collegeProgram = 'College Program is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      id: '',
      lastName: '',
      firstName: '',
      middleName: '',
      schoolLevel: 'COLLEGE',
      section: '',
      yearLevel: 'YEAR_1',
      status: 'ACTIVE',
    });
    setHasMiddleName(true);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-neutral-800">Add Student</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Student ID */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="student-id" className="text-sm font-semibold text-neutral-700">
                Student ID (11 digits) <span className="text-rose-500">*</span>
              </label>
              <input
                id="student-id"
                type="text"
                maxLength={11}
                value={formData.id}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handleChange('id', value);
                }}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., 20241234567"
              />
              {errors.id && <span className="text-xs text-rose-600">{errors.id}</span>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="last-name" className="text-sm font-semibold text-neutral-700">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="last-name"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., Dela Cruz"
              />
              {errors.lastName && <span className="text-xs text-rose-600">{errors.lastName}</span>}
            </div>

            {/* First Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="first-name" className="text-sm font-semibold text-neutral-700">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="first-name"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., Juan"
              />
              {errors.firstName && <span className="text-xs text-rose-600">{errors.firstName}</span>}
            </div>

            {/* Middle Name */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="middle-name" className="text-sm font-semibold text-neutral-700">
                  Middle Name {hasMiddleName && <span className="text-rose-500">*</span>}
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!hasMiddleName}
                    onChange={() => {
                      setHasMiddleName(!hasMiddleName);
                      if (hasMiddleName) {
                        handleChange('middleName', '');
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
                value={formData.middleName || ''}
                onChange={(e) => handleChange('middleName', e.target.value)}
                disabled={!hasMiddleName}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40 disabled:bg-neutral-100 disabled:text-neutral-400"
                placeholder={hasMiddleName ? 'e.g., Santos' : 'N/A'}
              />
              {errors.middleName && <span className="text-xs text-rose-600">{errors.middleName}</span>}
            </div>

            {/* School Level */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="school-level" className="text-sm font-semibold text-neutral-700">
                School Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="school-level"
                value={formData.schoolLevel}
                onChange={(e) => handleChange('schoolLevel', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
              >
                <option value="COLLEGE">College</option>
                <option value="SHS">Senior High School</option>
              </select>
            </div>

            {/* Conditional: SHS Strand or College Program */}
            {formData.schoolLevel === 'SHS' ? (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="shs-strand" className="text-sm font-semibold text-neutral-700">
                  SHS Strand <span className="text-rose-500">*</span>
                </label>
                <input
                  id="shs-strand"
                  type="text"
                  value={formData.shsStrand || ''}
                  onChange={(e) => handleChange('shsStrand', e.target.value)}
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
                  value={formData.collegeProgram || ''}
                  onChange={(e) => handleChange('collegeProgram', e.target.value)}
                  className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                  placeholder="e.g., BSCS, BSIT, BSBA"
                />
                {errors.collegeProgram && <span className="text-xs text-rose-600">{errors.collegeProgram}</span>}
              </div>
            )}

            {/* Section */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="section" className="text-sm font-semibold text-neutral-700">
                Section <span className="text-rose-500">*</span>
              </label>
              <input
                id="section"
                type="text"
                value={formData.section}
                onChange={(e) => handleChange('section', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., 1A, 2B"
              />
              {errors.section && <span className="text-xs text-rose-600">{errors.section}</span>}
            </div>

            {/* Year Level */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="year-level" className="text-sm font-semibold text-neutral-700">
                Year Level <span className="text-rose-500">*</span>
              </label>
              <select
                id="year-level"
                value={formData.yearLevel}
                onChange={(e) => handleChange('yearLevel', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
              >
                {formData.schoolLevel === 'SHS' ? (
                  <>
                    <option value="GRADE_11">Grade 11</option>
                    <option value="GRADE_12">Grade 12</option>
                  </>
                ) : (
                  <>
                    <option value="YEAR_1">1st Year</option>
                    <option value="YEAR_2">2nd Year</option>
                    <option value="YEAR_3">3rd Year</option>
                    <option value="YEAR_4">4th Year</option>
                  </>
                )}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-semibold text-neutral-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="GRADUATED">Graduated</option>
                <option value="DROPPED">Dropped</option>
              </select>
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-number" className="text-sm font-semibold text-neutral-700">
                Contact Number
              </label>
              <input
                id="contact-number"
                type="tel"
                value={formData.contactNumber || ''}
                onChange={(e) => handleChange('contactNumber', e.target.value)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400/40"
                placeholder="e.g., 09171234567"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full border border-neutral-800 bg-neutral-900 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentDialog;
