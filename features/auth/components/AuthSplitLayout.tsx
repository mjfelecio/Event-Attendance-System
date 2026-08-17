import Image from "next/image";
import type { ReactNode } from "react";

import AuthBackdrop from "./AuthBackdrop";

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
    <AuthBackdrop>
      <section className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/35 bg-white/10 shadow-[0_24px_90px_rgba(15,23,42,0.35)] backdrop-blur-md">
        <div className="grid md:grid-cols-2">
          <aside className="relative hidden min-h-[640px] items-center justify-center overflow-hidden p-10 text-white md:flex bg-[linear-gradient(165deg,rgba(3,10,48,0.94)_0%,rgba(41,19,104,0.9)_55%,rgba(92,24,100,0.88)_100%)]">
            <div className="pointer-events-none absolute -left-10 top-28 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute bottom-10 right-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

            <div className="relative text-center">
              <Image
                src="/logos/school/logo.png"
                alt="ACLC College of Ormoc City logo"
                width={360}
                height={360}
                className="h-90 w-90 object-contain drop-shadow-[0_16px_32px_rgba(15,23,42,0.45)]"
                priority
              />
            </div>

            <p className="absolute bottom-10 left-10 text-[10px] text-white/80">
              @ACLC College of Ormoc City, Inc.
            </p>
          </aside>

          <div className="bg-white/90 p-6 text-slate-900 sm:p-8 md:min-h-[640px] md:p-10">
            <div className="w-full md:max-w-md">
              <div className="mb-5 flex justify-center md:hidden">
                <Image
                  src="/logos/school/logo.png"
                  alt="ACLC College of Ormoc City logo"
                  width={104}
                  height={104}
                  className="h-24 w-24 object-contain"
                  priority
                />
              </div>

              <div className="mb-7 space-y-2">
                <h2 className="text-center text-3xl font-semibold tracking-tight text-slate-900">
                  ACLC Event Attendance
                </h2>
                <p className="text-center text-[12px] text-slate-500">
                  {brandingSubtitle}
                </p>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>

              <div className="mt-7">{children}</div>
              <div className="mt-6 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
                {footer}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthBackdrop>
  );
};

export default AuthSplitLayout;
