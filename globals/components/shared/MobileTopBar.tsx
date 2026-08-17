"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";

import { useAuth } from "@/globals/contexts/AuthContext";
import { useLogout } from "@/globals/hooks/useLogout";
import { focusRing } from "@/globals/constants/designTokens";
import { cn } from "@/globals/libs/shad-cn";

/**
 * Sticky mobile/tablet header shown below the `lg` breakpoint. Navigation
 * itself lives in `MobileBottomNav`; this bar just carries branding plus the
 * account affordances the desktop `Sidebar` would otherwise host.
 */
const MobileTopBar = () => {
  const { user } = useAuth();
  const handleLogout = useLogout();

  const initials = (user?.name ?? "Organizer")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <header className="print:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        <Image
          src="/logos/school/logo.png"
          alt="ACLC logo"
          width={28}
          height={28}
          className="size-7 shrink-0 object-contain"
        />
        <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
          ACLC Attendance
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_100%)] text-xs font-semibold text-white"
          title={user?.name ?? "Organizer"}
          aria-label={`Signed in as ${user?.name ?? "Organizer"}`}
        >
          {initials || "O"}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex size-9 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700",
            focusRing
          )}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
};

export default MobileTopBar;
