"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthSplitLayout from "@/features/auth/components/AuthSplitLayout";
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
      <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_50%,#ef4444_100%)] text-white/90">
        Preparing signup...
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
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
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

      setSuccess("Request submitted! An admin will review your account shortly.");
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
    <AuthSplitLayout
      mode="signup"
      title="Request Access"
      subtitle="Submit your details and wait for administrator approval."
      footer={
        <p>
          Already approved?{" "}
          <Link
            href="/login"
            className="font-semibold text-slate-900 underline-offset-2 hover:underline"
          >
            Return to login
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
          className="w-full rounded-xl bg-[linear-gradient(90deg,#0b4dff_0%,#6d28d9_50%,#ef4444_100%)] py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(109,40,217,0.35)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </AuthSplitLayout>
  );
};

export default SignupPage;
