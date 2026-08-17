"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/globals/contexts/AuthContext";
import { toastDanger } from "@/globals/components/shared/toasts";

/** Signs the user out and redirects to login, or surfaces the failure. */
export const useLogout = () => {
  const { logout } = useAuth();
  const router = useRouter();

  return async () => {
    // Only navigate away if the server actually cleared the session; otherwise
    // surface the failure rather than showing a logged-out UI over a live cookie.
    const ok = await logout();
    if (ok) {
      router.replace("/login");
    } else {
      toastDanger("Couldn't sign out. Please try again.");
    }
  };
};
