"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import FormInput from "@/globals/components/shared/FormInput";
import { Button } from "@/globals/components/shad-cn/button";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";
import { useChangePassword } from "@/globals/hooks/useAccount";
import { useAuth } from "@/globals/contexts/AuthContext";
import {
  ChangePasswordFormValues,
  changePasswordFormSchema,
} from "@/features/auth/schema/changePasswordSchema";

type Props = {
  /** Runs after the password has changed and the session has been re-read. */
  onSuccess?: () => void;
  submitLabel?: string;
};

/**
 * The change-password fields on their own, so the settings sheet and the
 * forced-change gate in the app shell share one implementation.
 */
const ChangePasswordForm = ({
  onSuccess,
  submitLabel = "Change password",
}: Props) => {
  const { refresh } = useAuth();
  const { mutateAsync: changePassword } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    try {
      await changePassword({ currentPassword, newPassword });
      // The server cleared mustChangePassword and re-signed the cookie, but the
      // client's user object is only fetched on mount - re-read it so the
      // forced-change gate actually lifts.
      await refresh();
      reset();
      toastSuccess("Password changed", "Use it the next time you sign in.");
      onSuccess?.();
    } catch (error) {
      toastDanger(
        "Couldn't change password",
        error instanceof Error ? error.message : undefined,
      );
    }
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <FormInput
        label="Current password"
        type="password"
        autoComplete="current-password"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
      />
      <FormInput
        label="New password"
        type="password"
        autoComplete="new-password"
        description="At least 8 characters."
        {...register("newPassword")}
        error={errors.newPassword?.message}
      />
      <FormInput
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
