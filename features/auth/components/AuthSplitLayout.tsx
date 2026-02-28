import Image from "next/image";
import type { ReactNode } from "react";

type AuthSplitLayoutProps = {
  mode: "login" | "signup";
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

const AuthSplitLayout = ({
  mode,
  title,
  subtitle,
  children,
  footer,
}: AuthSplitLayoutProps) => {
  const brandingSubtitle =
    mode === "login"
      ? "Sign in to manage events and attendance records."
      : "Request access to manage events and attendance records.";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_50%,#ef4444_100%)] px-4 py-8">
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(11,77,255,0.7)_0%,_rgba(109,40,217,0.55)_50%,_rgba(239,68,68,0.35)_100%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(239,68,68,0.65)_0%,_rgba(109,40,217,0.5)_45%,_rgba(11,77,255,0.35)_100%)] blur-3xl" />

      <section className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/35 bg-white/10 shadow-[0_24px_90px_rgba(15,23,42,0.35)] backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <aside className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden p-10 text-white md:flex bg-[linear-gradient(165deg,rgba(5,16,73,0.9)_0%,rgba(56,26,133,0.86)_55%,rgba(129,31,129,0.85)_100%)]">
            <div className="pointer-events-none absolute -left-10 top-28 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute bottom-10 right-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <Image
                src="/login/logo.png"
                alt="ACLC College of Ormoc City logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                priority
              />
              <p className="text-xs uppercase tracking-[0.3em] text-white/85">
                ACLC
              </p>
            </div>

            <div className="relative space-y-4">
              <h2 className="text-4xl font-semibold leading-tight">
                ACLC Event Attendance
              </h2>
              <p className="max-w-sm text-base text-white/85">
                {brandingSubtitle}
              </p>
            </div>

            <p className="relative text-sm text-white/80">
              ACLC College of Ormoc City, Inc.
            </p>
          </aside>

          <div className="bg-white/90 p-6 text-slate-900 sm:p-8 md:p-10">
            <div className="mb-5 flex justify-center md:hidden">
              <Image
                src="/login/logo.png"
                alt="ACLC College of Ormoc City logo"
                width={84}
                height={84}
                className="h-20 w-20 object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>

            <div className="mt-7">{children}</div>
            <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
              {footer}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthSplitLayout;
