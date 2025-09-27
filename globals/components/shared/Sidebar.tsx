"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import { RxDashboard } from "react-icons/rx";
import { LuCalendar, LuLogOut, LuSunMedium, LuMoon } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { useSidebar } from "@/globals/contexts/SidebarContext";
import { LuQrCode } from "react-icons/lu";

/**
 * Represents a single navigation item in the sidebar.
 */
type NavigationItem = {
  text: string;
  icon: IconType;
  route: string;
};

type SidebarButtonProps = {
  text: string;
  icon: IconType;
  isExpanded: boolean;
  onClick: () => void;
  active?: boolean;
  theme: "light" | "dark";
};

type LogoutButtonProps = {
  isExpanded: boolean;
  onClick: () => void;
};

type ThemeSwitchProps = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

const navigationItems: NavigationItem[] = [
  { text: "Dashboard", route: "/dashboard", icon: RxDashboard },
  { text: "Calendar", route: "/calendar", icon: LuCalendar },
  { text: "Manage List", route: "/manage-list", icon: FiUsers },
  { text: "Attendance", route: "/attendance", icon: LuQrCode },
  { text: "Settings", route: "/settings", icon: IoSettingsOutline },
];

const SidebarButton = ({
  text,
  icon: Icon,
  onClick,
  isExpanded,
  active = false,
  theme,
}: SidebarButtonProps) => {
  const conditionalStyles = isExpanded ? "hover:translate-x-1" : "";
  const baseColors =
    theme === "dark"
      ? active
        ? "bg-gray-700 text-blue-400"
        : "bg-black text-gray-300 hover:bg-gray-700"
      : active
      ? "bg-blue-100 text-blue-700 font-medium"
      : "bg-white text-gray-800 hover:bg-slate-200 border border-transparent";

  return (
    <button
      onClick={onClick}
      className={`rounded-md p-2 flex items-center gap-3 transition-all hover:cursor-grab duration-300 ${conditionalStyles} ${baseColors}`}
    >
      <div className="size-8 flex items-center justify-center ">
        <Icon size={24} />
      </div>
      {isExpanded && (
        <p className="font-medium text-md overflow-hidden whitespace-nowrap transition-opacity duration-300 opacity-100">
          {text}
        </p>
      )}
    </button>
  );
};

const LogoutButton = ({ isExpanded, onClick }: LogoutButtonProps) => (
  <button
    onClick={onClick}
    className={`rounded-md p-2 flex items-center gap-3 transition-all duration-300 hover:translate-x-1
      bg-red-600 text-white hover:bg-red-700 hover:cursor-grab`}
  >
    <div className="size-8 flex items-center justify-center shrink-0">
      <LuLogOut size={24} />
    </div>
    {isExpanded && (
      <p className="font-medium text-md overflow-hidden whitespace-nowrap transition-opacity duration-300 opacity-100">
        Logout
      </p>
    )}
  </button>
);

const ThemeSwitch = ({ theme, setTheme }: ThemeSwitchProps) => {
  return (
    <div
      className={`rounded-lg size-10 flex justify-center items-center hover:cursor-pointer ${
        theme === "light" ? "hover:bg-gray-300" : "hover:bg-gray-600"
      }`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <LuSunMedium size={22} /> : <LuMoon size={22} />}
    </div>
  );
};

const Sidebar = () => {
  const { toggleExpanded, isExpanded } = useSidebar();

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const pathname = usePathname();

  const conditionalSidebarStyles = isExpanded ? "w-64" : "w-16";

  const sidebarBase =
    theme === "dark"
      ? "bg-black text-white"
      : "bg-gray-100 text-black border-r border-gray-300";

  const handleLogout = () => {
    alert("Logging out...");
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-2 transition-all duration-300 ${conditionalSidebarStyles} ${sidebarBase}`}
    >
      <div>
        {/* Sidebar Header */}
        <div
          className="mb-6 rounded-lg size-10 m-1 flex justify-center items-center hover:cursor-grab"
          onClick={() => toggleExpanded()}
        >
          <GiHamburgerMenu size={22} />
        </div>

        {/* Sidebar Navigations */}
        <div className="flex flex-col gap-1">
          {navigationItems.map((item, index) => (
            <SidebarButton
              key={index}
              text={item.text}
              icon={item.icon}
              isExpanded={isExpanded}
              onClick={() => item.route !== pathname && router.push(item.route)}
              active={pathname === item.route}
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* Logout Button pinned at bottom */}
      <div className="mb-2 flex flex-row justify-between items-center">
        <LogoutButton isExpanded={isExpanded} onClick={handleLogout} />
        {/* {expanded && (
          <ThemeSwitch theme={theme} setTheme={(theme) => setTheme(theme)} />
        )} */}
      </div>
    </div>
  );
};

export default Sidebar;
