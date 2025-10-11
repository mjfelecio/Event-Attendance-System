import { StudentRow } from "@/features/manage-list/types";
import { SchoolLevel, Student, StudentStatus, YearLevel } from "@prisma/client";

const YEAR_LEVEL_LABELS: Record<YearLevel, string> = {
  YEAR_1: "1st Year",
  YEAR_2: "2nd Year",
  YEAR_3: "3rd Year",
  YEAR_4: "4th Year",
  GRADE_11: "11th Grade",
  GRADE_12: "12th Grade",
};

export const slugify = (value?: string | null) => {
  if (!value) return undefined;
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export type StudentRowSource = {
  id: string;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  shsStrand: string | null;
  collegeProgram: string | null;
  section: string;
  yearLevel: YearLevel;
  schoolLevel: SchoolLevel;
  status: StudentStatus;
  contactNumber?: string | null;
  department?: string | null;
  departmentSlug?: string | null;
  house?: string | null;
  houseSlug?: string | null;
  updatedAt?: Date | string;
  name?: string | null;
  createdAt?: Date;
};

const coerceId = (id: string | number) => (typeof id === "number" ? String(id) : id);

export const mapStudentToSource = (student: Student | StudentRowSource): StudentRowSource => {
  const candidate = student as Student & StudentRowSource;

  return {
    id: coerceId(candidate.id),
    lastName: candidate.lastName ?? null,
    firstName: candidate.firstName ?? null,
    middleName: candidate.middleName ?? null,
    shsStrand: candidate.shsStrand ?? null,
    collegeProgram: candidate.collegeProgram ?? null,
    section: candidate.section,
    yearLevel: candidate.yearLevel,
    schoolLevel: candidate.schoolLevel,
    status: candidate.status,
    contactNumber: candidate.contactNumber ?? null,
    department: candidate.department ?? null,
    departmentSlug: candidate.departmentSlug ?? slugify(candidate.department) ?? undefined,
    house: candidate.house ?? null,
    houseSlug: candidate.houseSlug ?? slugify(candidate.house) ?? undefined,
    updatedAt: candidate.updatedAt ?? new Date(),
    name: candidate.name ?? null,
    createdAt: candidate.createdAt,
  };
};

export const mapStudentToRow = (student: StudentRowSource): StudentRow => {
  const isCollege = student.schoolLevel === "COLLEGE";
  const program = isCollege ? student.collegeProgram : student.shsStrand;
  const programSlug = slugify(program);

  const fallbackName = student.name?.trim() ?? "";
  const fallbackPieces = fallbackName ? fallbackName.split(" ") : [];
  const fallbackFirst = fallbackPieces[0] ?? "";
  const fallbackLast = fallbackPieces.length > 1 ? fallbackPieces[fallbackPieces.length - 1] : fallbackFirst;

  const firstName = student.firstName ?? fallbackFirst;
  const lastName = student.lastName ?? fallbackLast;
  const middleName = student.middleName ?? (fallbackPieces.length > 2 ? fallbackPieces.slice(1, -1).join(" ") : undefined);

  const updatedAt = student.updatedAt
    ? student.updatedAt instanceof Date
      ? student.updatedAt
      : new Date(student.updatedAt)
    : new Date();

  return {
    studentNumber: student.id,
    lastName,
    firstName,
    middleName,
    program: program ?? undefined,
    programSlug,
    collegeProgram: student.collegeProgram ?? undefined,
    shsStrand: student.shsStrand ?? undefined,
    department: student.department ?? undefined,
    departmentSlug: student.departmentSlug ?? slugify(student.department),
    house: student.house ?? undefined,
    houseSlug: student.houseSlug ?? slugify(student.house),
    section: student.section,
    yearLevelLabel: YEAR_LEVEL_LABELS[student.yearLevel],
    yearLevel: student.yearLevel,
    schoolLevel: student.schoolLevel,
    status: student.status,
    contactNumber: student.contactNumber ?? undefined,
    updatedAt: updatedAt.toISOString(),
  };
};

export const mapStudentsToRows = (
  students: Array<Student | StudentRowSource>
): StudentRow[] =>
  students
    .filter((student): student is Student | StudentRowSource => Boolean(student))
    .map((student) => mapStudentToRow(mapStudentToSource(student)));
