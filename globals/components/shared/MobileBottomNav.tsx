"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  QrCode,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/globals/libs/shad-cn";

type NavigationItem = {
  text: string;
  icon: LucideIcon;
  route: string;
  emphasized?: boolean;
};

const navigationItems: NavigationItem[] = [
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
  { text: "Calendar", route: "/calendar", icon: CalendarDays },
  { text: "Attendance", route: "/attendance", icon: QrCode, emphasized: true },
  { text: "Students", route: "/students", icon: Users },
  { text: "Reports", route: "/reports", icon: BarChart3 },
];

/** iOS-style fixed tab bar shown below the `lg` breakpoint. Same dark surface
 * and indigo active treatment as the desktop `Sidebar`; the Attendance tab —
 * the primary operator screen — is raised like a shutter button. */
const MobileBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  return (
    <nav
      aria-label="Primary"
      className="print:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] text-slate-300 shadow-[0_-8px_30px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.route);
          const onClick = () => {
            if (!active) router.push(item.route);
          };

          if (item.emphasized) {
            return (
              <div key={item.route} className="flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={onClick}
                  aria-label={item.text}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mt-8 flex size-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_100%)] text-white shadow-[0_10px_25px_rgba(37,99,235,0.45)] ring-4 ring-slate-950 transition-transform active:scale-95",
                    active && "ring-white/30"
                  )}
                >
                  <Icon className="size-6" />
                </button>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium leading-none",
                    active ? "text-white" : "text-slate-400"
                  )}
                >
                  {item.text}
                </span>
              </div>
            );
          }

          return (
            <button
              key={item.route}
              type="button"
              onClick={onClick}
              aria-label={item.text}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1 py-1"
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg px-3 py-1 transition-colors",
                  active &&
                    "bg-[linear-gradient(90deg,rgba(11,77,255,0.36)_0%,rgba(109,40,217,0.34)_100%)]"
                )}
              >
                <Icon className={cn("size-5", active ? "text-white" : "text-slate-400")} />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  active ? "text-white" : "text-slate-400"
                )}
              >
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
