import type { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import AuthBackdrop from "./AuthBackdrop";

type AuthStatusScreenProps = {
  /** `loading` shows a spinner; `error` shows an alert icon and expects `action`. */
  variant?: "loading" | "error";
  title?: string;
  message: string;
  /** Typically a single recovery `Button`. Only meaningful for `variant="error"`. */
  action?: ReactNode;
};

/**
 * AuthStatusScreen
 *
 * A single-purpose card on the `AuthBackdrop` for the moments an auth page has
 * no form to show: checking for an existing session, or reporting that
 * something (usually sign-out) failed. Used by all three `(auth)` pages so
 * "checking auth", "signing out", and "sign-out failed" share one visual
 * treatment instead of three ad hoc ones.
 *
 * Not intended for use outside `app/(auth)/**` — it assumes the dark gradient
 * backdrop this file supplies via {@link AuthBackdrop}.
 */
const AuthStatusScreen = ({
  variant = "loading",
  title,
  message,
  action,
}: AuthStatusScreenProps) => (
  <AuthBackdrop>
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl border border-white/20 bg-white/10 p-8 text-center text-white shadow-[0_24px_90px_rgba(15,23,42,0.35)] backdrop-blur-md">
      {variant === "loading" ? (
        <Loader2 className="size-6 animate-spin text-white/80" aria-hidden />
      ) : (
        <AlertCircle className="size-6 text-rose-300" aria-hidden />
      )}
      {title ? <p className="text-base font-semibold">{title}</p> : null}
      <p className="text-sm text-white/80">{message}</p>
      {action}
    </div>
  </AuthBackdrop>
);

export default AuthStatusScreen;
