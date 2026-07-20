import { SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { z } from "zod";

const baseStudentSchema = z
  .object({
    id: z.string().trim().length(11).regex(/^\d+$/),
    // trim() runs before min() so whitespace-only values are rejected, not stored.
    lastName: z.string().trim().min(1),
    firstName: z.string().trim().min(1),
    middleName: z.string().trim().optional().nullable(),
    schoolLevel: z.nativeEnum(SchoolLevel),
    shsStrand: z.string().trim().optional().nullable(),
    collegeProgram: z.string().trim().optional().nullable(),
    department: z.string().trim().optional().nullable(),
    house: z.string().trim().optional().nullable(),
    section: z.string().trim().min(1),
    yearLevel: z.nativeEnum(YearLevel),
    status: z.nativeEnum(StudentStatus),
    contactNumber: z.string().trim().min(1),
  })
  .superRefine((data, ctx) => {
    const hasDepartment = Boolean(data.department && data.department.trim());
    const hasStrand = Boolean(data.shsStrand && data.shsStrand.trim());
    const hasCollegeProgram = Boolean(
      data.collegeProgram && data.collegeProgram.trim()
    );

    if (data.schoolLevel === SchoolLevel.SHS) {
      if (!hasStrand) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SHS strand is required for Senior High School students.",
          path: ["shsStrand"],
        });
      }

      if (hasDepartment) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SHS students should not have a department.",
          path: ["department"],
        });
      }

      if (hasCollegeProgram) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SHS students should not have a college program.",
          path: ["collegeProgram"],
        });
      }

      if (
        data.yearLevel !== YearLevel.GRADE_11 &&
        data.yearLevel !== YearLevel.GRADE_12
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SHS students must be Grade 11 or Grade 12.",
          path: ["yearLevel"],
        });
      }
    }

    if (data.schoolLevel === SchoolLevel.COLLEGE) {
      if (!hasCollegeProgram) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "College program is required for college students.",
          path: ["collegeProgram"],
        });
      }

      if (hasStrand) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "College students should not have an SHS strand.",
          path: ["shsStrand"],
        });
      }

      if (
        data.yearLevel !== YearLevel.YEAR_1 &&
        data.yearLevel !== YearLevel.YEAR_2 &&
        data.yearLevel !== YearLevel.YEAR_3 &&
        data.yearLevel !== YearLevel.YEAR_4
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "College students must be from 1st to 4th year.",
          path: ["yearLevel"],
        });
      }
    }
  });

export const studentCreateSchema = baseStudentSchema;
export const studentUpdateSchema = baseStudentSchema;

export type StudentPayload = z.infer<typeof studentCreateSchema>;
