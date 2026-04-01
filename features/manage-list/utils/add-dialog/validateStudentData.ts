import { StudentFormData, StudentFormErrors } from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";

export const validateStudentData = (
  data: StudentFormData,
  requireMiddleName: boolean
): StudentFormErrors => {
  const errors: StudentFormErrors = {};
  const isCollegeYear =
    data.yearLevel === "YEAR_1" ||
    data.yearLevel === "YEAR_2" ||
    data.yearLevel === "YEAR_3" ||
    data.yearLevel === "YEAR_4";
  const isShsYear =
    data.yearLevel === "GRADE_11" || data.yearLevel === "GRADE_12";

  if (!/^\d{11}$/.test(data.id)) {
    errors.id = "Student ID must be exactly 11 digits";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (requireMiddleName && !data.middleName.trim()) {
    errors.middleName = "Middle name is required or mark none";
  }

  if (!data.section.trim()) {
    errors.section = "Section is required";
  }

  if (data.schoolLevel === "SHS" && !data.shsStrand.trim()) {
    errors.shsStrand = "SHS strand is required";
  }

  if (data.schoolLevel === "COLLEGE" && !data.collegeProgram.trim()) {
    errors.collegeProgram = "Program is required";
  }

  if (data.schoolLevel === "COLLEGE" && !data.department.trim()) {
    errors.department = "Department is required";
  }

  if (data.schoolLevel === "SHS" && data.department.trim()) {
    errors.department = "SHS students should not have a department";
  }

  if (data.schoolLevel === "COLLEGE" && !isCollegeYear) {
    errors.yearLevel = "College students must be from 1st to 4th year";
  }

  if (data.schoolLevel === "SHS" && !isShsYear) {
    errors.yearLevel = "SHS students must be Grade 11 or Grade 12";
  }

  if (!data.house.trim()) {
    errors.house = "House is required";
  }

  if (!data.contactNumber.trim()) {
    errors.contactNumber = "Contact number is required";
  }

  return errors;
};

export const prepareStudentSubmitPayload = (
  data: StudentFormData,
  requireMiddleName: boolean
): StudentFormData => ({
  ...data,
  id: data.id.trim(),
  lastName: data.lastName.trim(),
  firstName: data.firstName.trim(),
  middleName: requireMiddleName ? data.middleName.trim() : "N/A",
  shsStrand:
    data.schoolLevel === "SHS" ? data.shsStrand.trim() : "N/A",
  collegeProgram:
    data.schoolLevel === "COLLEGE" ? data.collegeProgram.trim() : "N/A",
  department: data.schoolLevel === "COLLEGE" ? data.department.trim() : "",
  house: data.house.trim(),
  section: data.section.trim(),
  contactNumber: data.contactNumber.trim(),
});
