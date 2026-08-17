"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/globals/components/shad-cn/button";
import FormInput from "@/globals/components/shared/FormInput";
import { toastDanger } from "@/globals/components/shared/toasts";
import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
import AuthStatusScreen from "@/features/auth/components/AuthStatusScreen";
import {
  SignupFormValues,
  signupSchema,
} from "@/features/auth/schema/signupSchema";
import { useAuth } from "@/globals/contexts/AuthContext";
import { ApiError, fetchApi } from "@/globals/utils/api";

const SignupPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    try {
      await fetchApi("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      setSubmittedName(name);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unexpected error. Please try again.";
      toastDanger(message);
    }
  });

  if (isLoading) {
    return <AuthStatusScreen message="Preparing signup…" />;
  }

  if (user) return null;

  return (
    <AuthSplitLayout
      mode="signup"
      title="Request Access"
      subtitle="Submit your details and wait for administrator approval."
      footer={
        <p>
          Already approved?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline-offset-2 hover:text-indigo-600 hover:underline"
          >
            Return to login
          </Link>
        </p>
      }
    >
      {submittedName ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-6 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Request submitted, {submittedName.split(" ")[0]}.
          </p>
          <p className="max-w-xs text-sm text-slate-500">
            An admin will review your account shortly. You&apos;ll be able to
            sign in once it&apos;s approved.
          </p>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <FormInput
            label="Full name"
            type="text"
            autoComplete="name"
            {...register("name")}
            error={errors.name?.message}
          />

          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <FormInput
            label="Password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password?.message}
            description={
              !errors.password ? "At least 8 characters." : undefined
            }
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit request"
            )}
          </Button>
        </form>
      )}
    </AuthSplitLayout>
  );
};

export default SignupPage;
