"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/globals/contexts/AuthContext";

const LoginPage = () => {
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("organizer@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Preparing sign in…
      </main>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message ?? "Unable to sign in.");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center bg-[url('/login/bg.png')] bg-cover bg-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Event Attendance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Use the admin credentials shared in the README or create an organizer
          account for approval.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting || isLoading}
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
    </main>
  );
};

export default LoginPage;
