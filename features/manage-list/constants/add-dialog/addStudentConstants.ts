import {
  SelectOption,
  StudentFormData,
} from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { label: "Select department", value: "" },
  { label: "Computer Studies", value: "Computer Studies" },
  { label: "Business Administration", value: "Business Administration" },
  { label: "Hotel Management", value: "Hotel Management" },
];

export const HOUSE_OPTIONS: SelectOption[] = [
  { label: "Select house", value: "" },
  { label: "Giallio", value: "Giallio" },
  { label: "Azul", value: "Azul" },
  { label: "Cahel", value: "Cahel" },
  { label: "Roxxo", value: "Roxxo" },
  { label: "Vierrdy", value: "Vierrdy" },
];

export const DEFAULT_FORM_STATE: StudentFormData = {
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
};
