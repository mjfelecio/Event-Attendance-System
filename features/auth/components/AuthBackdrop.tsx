import type { ReactNode } from "react";

import { cn } from "@/globals/libs/shad-cn";

type AuthBackdropProps = {
  children: ReactNode;
  className?: string;
};

/**
 * AuthBackdrop
 *
 * The full-bleed indigo/violet/rose gradient background (plus decorative blur
 * blobs) shared by every unauthenticated screen — the split-panel login/signup
 * card and the brief loading/status screens both sit on it.
 *
 * Extracted so the background is defined in exactly one place. It previously
 * existed twice with slightly different gradient stops (`AuthSplitLayout`'s
 * card background vs. the login/signup pages' own "Preparing…" loading
 * screens), which produced a visible colour flash between the loading state
 * and the page it resolved to.
 *
 * This is deliberately its own visual language, not the app-interior
 * `page.surface`/`PageHeader` treatment from `designTokens.ts` — the
 * unauthenticated gate is a different context from the operator tool behind
 * it, and this branding is intentional, not arbitrary.
 */
const AuthBackdrop = ({ children, className }: AuthBackdropProps) => (
  <main
    className={cn(
      "relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0936b8_0%,#4b1f97_50%,#a9283f_100%)] px-4 py-8",
      className,
    )}
  >
    <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(9,54,184,0.65)_0%,_rgba(75,31,151,0.5)_50%,_rgba(169,40,63,0.3)_100%)] blur-3xl" />
    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(169,40,63,0.55)_0%,_rgba(75,31,151,0.45)_45%,_rgba(9,54,184,0.3)_100%)] blur-3xl" />
    <div className="relative w-full">{children}</div>
  </main>
);

export default AuthBackdrop;
