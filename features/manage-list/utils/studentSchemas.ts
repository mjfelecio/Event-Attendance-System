import { SchoolLevel, StudentStatus, YearLevel } from "@prisma/client";
import { z } from "zod";

export const studentCreateSchema = z.object({
  id: z.string().length(11).regex(/^\d+$/),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  middleName: z.string().min(1),
  schoolLevel: z.nativeEnum(SchoolLevel),
  shsStrand: z.string().min(1),
  collegeProgram: z.string().min(1),
  department: z.string().min(1),
  house: z.string().min(1),
  section: z.string().min(1),
  yearLevel: z.nativeEnum(YearLevel),
  status: z.nativeEnum(StudentStatus),
  contactNumber: z.string().min(1),
});

export const studentUpdateSchema = studentCreateSchema;

export type StudentPayload = z.infer<typeof studentCreateSchema>;
