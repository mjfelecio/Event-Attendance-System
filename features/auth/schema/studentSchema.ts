import { z } from "zod";

export const studentSchema = z.object({
  id: z.string().length(11, "ID must be 11 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional().or(z.literal("")),
});

export type StudentFormValues = z.infer<typeof studentSchema>;