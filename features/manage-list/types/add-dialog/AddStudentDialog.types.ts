export type StudentFormMode = "add" | "edit";

export type StudentFormData = {
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
};

export type StudentFormErrors = Partial<Record<keyof StudentFormData, string>>;

export type SelectOption = {
  label: string;
  value: string;
};

export type YearLevelOption = SelectOption;

export type AddStudentDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
  initialData?: StudentFormData;
  mode?: StudentFormMode;
  title?: string;
  submitLabel?: string;
};
