import { z } from "zod";

/** Matches the signup rule so a chosen password is never weaker than at signup. */
const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters");

/** What `POST /api/auth/change-password` accepts. */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword,
});

/**
 * What the form collects. The confirmation field is client-side only - the API
 * has no use for it.
 */
export const changePasswordFormSchema = changePasswordSchema
  .extend({ confirmPassword: z.string().min(1, "Please confirm the password") })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    if (data.newPassword === data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New password must differ from the current one",
        path: ["newPassword"],
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
