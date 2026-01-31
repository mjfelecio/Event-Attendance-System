"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/globals/contexts/AuthContext";
import { loginSchema } from "@/features/auth/schema/loginSchema";
import { ZodError } from "zod";

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
      <main className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Preparing sign in…
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[url('/login/bg.png')] bg-cover bg-center">
      {/* Glass Card */}
      <div
        className="
          relative overflow-hidden
          w-full max-w-sm rounded-2xl p-8
          bg-gradient-to-br from-white/70 via-white/45 to-white/30
          backdrop-blur-2xl
          border border-white/50
          shadow-[0_10px_40px_rgba(15,23,42,0.18)]
        "
      >
        {/* Glass highlight */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/60 via-white/10 to-transparent opacity-60" />

        <div className="relative">
          <h1 className="text-2xl font-semibold text-slate-900 text-center">
            Event Attendance
          </h1>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                  mt-1 w-full rounded-lg
                  bg-white/50 border border-white/60
                  px-3 py-2 text-sm
                  placeholder:text-slate-400
                  focus:border-white focus:ring-2 focus:ring-white/60 focus:outline-none
                "
                />
              </label>
              {fieldErrors?.email && (
                <p className="text-sm text-red-600" role="alert">
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
                  className="
                  mt-1 w-full rounded-lg
                  bg-white/50 border border-white/60
                  px-3 py-2 text-sm
                  placeholder:text-slate-400
                  focus:border-white focus:ring-2 focus:ring-white/60 focus:outline-none
                "
                />
              </label>
              {fieldErrors?.password && (
                <p className="text-sm text-red-600" role="alert">
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
              className="
                w-full rounded-lg
                bg-slate-900 py-2 text-sm font-semibold text-white
                transition hover:bg-slate-800
                disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New organizer?{" "}
            <Link
              href="/signup"
              className="font-semibold text-slate-900 underline-offset-2 hover:underline"
            >
              Request access
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
