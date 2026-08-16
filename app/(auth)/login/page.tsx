"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/globals/components/shad-cn/button";
import FormInput from "@/globals/components/shared/FormInput";
import { toastDanger } from "@/globals/components/shared/toasts";
import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
import AuthStatusScreen from "@/features/auth/components/AuthStatusScreen";
import {
  LoginFormValues,
  loginSchema,
} from "@/features/auth/schema/loginSchema";
import { useAuth } from "@/globals/contexts/AuthContext";

const LoginPage = () => {
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const result = await login(email, password);

      if (!result.success) {
        toastDanger(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/dashboard");
    } catch {
      toastDanger("Unexpected error. Please try again.");
    }
  });

  if (isLoading) {
    return <AuthStatusScreen message="Preparing sign in…" />;
  }

  if (user) return null;

  return (
    <AuthSplitLayout
      mode="login"
      title="Sign In"
      subtitle="Enter your organizer credentials to continue."
      footer={
        <p>
          New organizer?{" "}
          <Link
            href="/signup"
            className="font-semibold text-slate-900 underline-offset-2 hover:text-indigo-600 hover:underline"
          >
            Request access
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
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
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthSplitLayout>
  );
};

export default LoginPage;
