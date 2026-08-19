"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  QrCode,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/globals/contexts/AuthContext";
import { useSidebar } from "@/globals/contexts/SidebarContext";
import { useLogout } from "@/globals/hooks/useLogout";
import { cn } from "@/globals/libs/shad-cn";

type NavigationItem = {
  text: string;
  icon: LucideIcon;
  route: string;
};

type NavigationButtonProps = {
  item: NavigationItem;
  isExpanded: boolean;
  active: boolean;
  onClick: () => void;
};

const navigationItems: NavigationItem[] = [
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
  { text: "Calendar", route: "/calendar", icon: CalendarDays },
  { text: "Manage List", route: "/manage-list", icon: Users },
  { text: "Attendance", route: "/attendance", icon: QrCode },
  { text: "Reports", route: "/reports", icon: BarChart3 },
  // Shown to everyone: organizers get their own account controls there, admins
  // additionally get the group, user, and system panels.
  { text: "Settings", route: "/settings", icon: Settings },
];

const NavigationButton = ({
  item,
  isExpanded,
  active,
  onClick,
}: NavigationButtonProps) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center rounded-xl px-3 py-2.5 transition-all duration-200",
        isExpanded ? "gap-3" : "justify-center",
        active
          ? "bg-[linear-gradient(90deg,rgba(11,77,255,0.36)_0%,rgba(109,40,217,0.34)_100%)] text-white"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      )}
      aria-label={item.text}
      title={item.text}
    >
      <Icon className="size-5 shrink-0" />
      {isExpanded ? (
        <span className="truncate text-sm font-medium">{item.text}</span>
      ) : null}
    </button>
  );
};

/** Desktop-only fixed nav rail (`lg:` and up). Mobile uses `MobileTopBar` +
 * `MobileBottomNav` instead — see docs/design-system.md responsive guidance. */
const Sidebar = () => {
  const { toggleExpanded, isExpanded } = useSidebar();
  const { user } = useAuth();
  const handleLogout = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const isRouteActive = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  const initials = (user?.name ?? "Organizer")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      {/* Reserves space in the desktop flex row so the fixed rail doesn't
          overlap content. */}
      <div
        className={cn(
          "hidden shrink-0 transition-all duration-300 lg:block",
          isExpanded ? "lg:w-72" : "lg:w-20"
        )}
      />

      <aside
        className={cn(
          "print:hidden fixed inset-y-0 left-0 z-40 hidden h-screen flex-col border-r border-white/10 bg-slate-950/95 p-3 text-slate-100 shadow-[0_20px_60px_rgba(2,6,23,0.5)] backdrop-blur-xl transition-all duration-300 lg:flex",
          isExpanded ? "lg:w-72" : "lg:w-20"
        )}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
          {isExpanded ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Image
                  src="/logos/school/logo.png"
                  alt="ACLC logo"
                  width={38}
                  height={38}
                  className="size-[38px] object-contain"
                  priority
                />
                <div className="leading-tight">
                  <p className="text-xs font-semibold tracking-[0.18em] text-white/90">
                    ACLC
                  </p>
                  <p className="text-[11px] text-slate-300">Attendance</p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleExpanded}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={toggleExpanded}
                className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <Menu className="size-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="mt-4 flex-1 space-y-1.5">
          {navigationItems.map((item) => (
            <NavigationButton
              key={item.route}
              item={item}
              isExpanded={isExpanded}
              active={isRouteActive(item.route)}
              onClick={() => {
                if (!isRouteActive(item.route)) {
                  router.push(item.route);
                }
              }}
            />
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {isExpanded ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "Organizer"}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                {user?.role ?? "ORGANIZER"}
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4dff_0%,#6d28d9_100%)] text-xs font-semibold text-white">
                {initials || "O"}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center rounded-xl bg-red-600 px-3 py-2.5 text-white transition-colors hover:bg-red-700",
              isExpanded ? "gap-3" : "justify-center"
            )}
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="size-5 shrink-0" />
            {isExpanded ? <span className="text-sm font-medium">Logout</span> : null}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
