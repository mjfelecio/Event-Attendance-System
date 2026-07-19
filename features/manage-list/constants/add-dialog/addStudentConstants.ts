import {
  SelectOption,
  StudentFormData,
} from "@/features/manage-list/types/add-dialog/AddStudentDialog.types";
import {
  COLLEGE_PROGRAMS,
  DEPARTMENTS,
  HOUSES,
  SHS_STRANDS,
} from "@/globals/constants/groups";

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { label: "Select department", value: "" },
  ...DEPARTMENTS.map((d) => ({ label: d.name, value: d.name })),
];

export const HOUSE_OPTIONS: SelectOption[] = [
  { label: "Select house", value: "" },
  ...HOUSES.map((h) => ({ label: h.name, value: h.name })),
];

export const PROGRAM_OPTIONS: SelectOption[] = [
  { label: "Select program", value: "" },
  ...COLLEGE_PROGRAMS.map((p) => ({
    label: `${p.code} — ${p.name}`,
    value: p.code,
  })),
];

export const STRAND_OPTIONS: SelectOption[] = [
  { label: "Select strand", value: "" },
  ...SHS_STRANDS.map((s) => ({
    label: s.code === s.name ? s.code : `${s.code} — ${s.name}`,
    value: s.code,
  })),
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
