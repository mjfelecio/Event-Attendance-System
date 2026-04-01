"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ZodError } from "zod";

import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
import { loginSchema } from "@/features/auth/schema/loginSchema";
import { useAuth } from "@/globals/contexts/AuthContext";

const LoginPage = () => {
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    "email" | "password",
    string
  > | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoginError(null);
      setFieldErrors(null);
      setIsSubmitting(true);

      const { email: validatedEmail, password: validatedPass } =
        loginSchema.parse({ email, password });

      const result = await login(validatedEmail, validatedPass);

      setIsSubmitting(false);

      if (!result.success) {
        setLoginError(result.message ?? "Unable to sign in.");
        return;
      }

      router.replace("/dashboard");
    } catch (error) {
      if (error instanceof ZodError) {
        handleFieldErrors(error);
      }

      if (error instanceof Error) {
        setLoginError(error.message);
        console.log(`Unknown error prevented submission: ${error}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldErrors = useCallback((error: ZodError) => {
    // Note that this only catches the form errors client side,
    // the login errors received from the server will just show
    // the error message below directly
    const errors = {
      email: "",
      password: "",
    };

    error.issues.forEach((iss) => {
      if (iss.path.includes("email")) {
        errors.email = iss.message;
      }

      if (iss.path.includes("password")) {
        errors.password = iss.message;
      }
    });

    setFieldErrors(errors);
  }, []);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_50%,#ef4444_100%)] text-white/90">
        Preparing sign in...
      </main>
    );
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
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Request access
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          {fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              * {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          {fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              * {fieldErrors.password}
            </p>
          )}
        </div>

        {loginError && (
          <p className="text-sm text-red-600" role="alert">
            * {loginError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full rounded-xl bg-[linear-gradient(90deg,#0b4dff_0%,#6d28d9_50%,#ef4444_100%)] py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(109,40,217,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default LoginPage;
