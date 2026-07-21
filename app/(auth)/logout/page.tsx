"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/globals/contexts/AuthContext";

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  const inFlightRef = useRef(false);

  const attemptLogout = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setFailed(false);

    const ok = await logout();
    inFlightRef.current = false;

    if (ok) {
      router.replace("/login");
    } else {
      setFailed(true);
    }
  }, [logout, router]);

  useEffect(() => {
    attemptLogout();
  }, [attemptLogout]);

  if (failed) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-3">
          <p className="text-slate-700">
            We couldn&apos;t sign you out. Please check your connection and try
            again.
          </p>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => void attemptLogout()}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return null;
};

export default LogoutPage;
