import type { ReactNode } from "react";

import { cn } from "@/globals/libs/shad-cn";

type AuthBackdropProps = {
  children: ReactNode;
  className?: string;
};

/**
 * AuthBackdrop
 *
 * The full-bleed dark background (plus a subtle indigo glow) shared by every
 * unauthenticated screen — the login/signup card and the brief loading/status
 * screens both sit on it.
 *
 * Extracted so the background is defined in exactly one place. It previously
 * existed twice with slightly different treatments (the login/signup card vs.
 * the pages' own "Preparing…" loading screens), which produced a visible
 * flash between the loading state and the page it resolved to.
 *
 * This is deliberately its own visual language, not the app-interior
 * `page.surface`/`PageHeader` treatment from `designTokens.ts` — the
 * unauthenticated gate is a different context from the operator tool behind
 * it, and this branding is intentional, not arbitrary.
 */
const AuthBackdrop = ({ children, className }: AuthBackdropProps) => (
  <main
    className={cn(
      "relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8",
      className,
    )}
  >
    <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.28)_0%,_transparent_70%)] blur-3xl" />
    <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(99,102,241,0.18)_0%,_transparent_70%)] blur-3xl" />
    <div className="relative w-full">{children}</div>
  </main>
);

export default AuthBackdrop;
