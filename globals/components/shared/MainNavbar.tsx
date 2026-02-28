"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { CalendarClock, ChevronRight } from "lucide-react";

import { useAuth } from "@/globals/contexts/AuthContext";

type RouteMeta = {
  title: string;
  subtitle: string;
};

const routeMeta: Array<{ startsWith: string; meta: RouteMeta }> = [
  {
    startsWith: "/dashboard",
    meta: {
      title: "Dashboard",
      subtitle: "Review pending approvals and workspace activity.",
    },
  },
  {
    startsWith: "/calendar",
    meta: {
      title: "Calendar",
      subtitle: "Plan and manage event schedules.",
    },
  },
  {
    startsWith: "/manage-list",
    meta: {
      title: "Manage List",
      subtitle: "Maintain student rosters and categories.",
    },
  },
  {
    startsWith: "/attendance",
    meta: {
      title: "Attendance",
      subtitle: "Track attendance and monitor participant records.",
    },
  },
  {
    startsWith: "/reports",
    meta: {
      title: "Reports",
      subtitle: "Analyze event outcomes and attendance metrics.",
    },
  },
  {
    startsWith: "/settings",
    meta: {
      title: "Settings",
      subtitle: "Configure account and system preferences.",
    },
  },
];

const getRouteMeta = (pathname: string): RouteMeta => {
  const match = routeMeta.find((item) => pathname.startsWith(item.startsWith));
  return (
    match?.meta ?? {
      title: "Workspace",
      subtitle: "Manage your event attendance system.",
    }
  );
};

const MainNavbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const meta = useMemo(() => getRouteMeta(pathname), [pathname]);

  const initials = (user?.name ?? "Organizer")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const today = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between px-4 py-3 md:px-8">
        <div>
          <p className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <span>Workspace</span>
            <ChevronRight className="size-3.5" />
            <span>{meta.title}</span>
          </p>
          <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
            {meta.title}
          </h1>
          <p className="hidden text-xs text-slate-500 md:block">
            {meta.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 sm:flex">
            <CalendarClock className="size-3.5" />
            <span>{today}</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_55%,#ef4444_100%)] text-xs font-semibold text-white">
              {initials || "O"}
            </div>
            <div className="hidden sm:block">
              <p className="max-w-[12rem] truncate text-xs font-semibold text-slate-800">
                {user?.name ?? "Organizer"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {user?.role ?? "ORGANIZER"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
