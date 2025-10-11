import { SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { z } from "zod";

const baseStudentSchema = z
  .object({
    id: z.string().length(11).regex(/^\d+$/),
    lastName: z.string().min(1),
    firstName: z.string().min(1),
    middleName: z.string().min(1),
    schoolLevel: z.nativeEnum(SchoolLevel),
    shsStrand: z.string().trim().optional().nullable(),
    collegeProgram: z.string().trim().optional().nullable(),
    department: z.string().min(1),
    house: z.string().min(1),
    section: z.string().min(1),
    yearLevel: z.nativeEnum(YearLevel),
    status: z.nativeEnum(StudentStatus),
    contactNumber: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.schoolLevel === SchoolLevel.SHS) {
      if (!data.shsStrand || data.shsStrand.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SHS strand is required for Senior High School students.",
          path: ["shsStrand"],
        });
      }
    }

    if (data.schoolLevel === SchoolLevel.COLLEGE) {
      if (!data.collegeProgram || data.collegeProgram.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "College program is required for college students.",
          path: ["collegeProgram"],
        });
      }
    }
  });

export const studentCreateSchema = baseStudentSchema;
export const studentUpdateSchema = baseStudentSchema;

export type StudentPayload = z.infer<typeof studentCreateSchema>;
