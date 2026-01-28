"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/globals/contexts/AuthContext";

const SignupPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Preparing signup…
      </main>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "Unable to submit signup."
        );
        return;
      }

      setSuccess(
        "Request submitted! An admin will review your account shortly."
      );
      setName("");
      setEmail("");
      setPassword("");
    } catch (submitError) {
      setError("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Organizer access</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit your details below. An administrator will approve or reject
          your request.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full name
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              type="text"
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="text-sm text-green-600" role="status">
              {success}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit request"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already approved?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Return to login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
