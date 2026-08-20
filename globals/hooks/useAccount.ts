import { useMutation } from "@tanstack/react-query";

import { fetchApi } from "@/globals/utils/api";
import type { AuthUser } from "@/globals/contexts/AuthContext";

type ChangePasswordArgs = {
  currentPassword: string;
  newPassword: string;
};

/**
 * Changes the signed-in user's own password.
 *
 * The server re-issues the session cookie, but the client's `AuthUser` is held
 * in React state and fetched once on mount - callers must follow a success with
 * `useAuth().refresh()` so a cleared `mustChangePassword` actually lifts the
 * forced-change gate.
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (args: ChangePasswordArgs) =>
      fetchApi<AuthUser>("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(args),
      }),
  });
};
