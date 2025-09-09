"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { IconType } from "react-icons/lib";

// Navigation Icons
import { RxDashboard } from "react-icons/rx";
import { LuCalendar } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";

/**
 * Represents a single navigation item in the sidebar.
 */
type NavigationItem = {
  /** Display text for the navigation item */
  text: string;
  /** Icon component for the navigation item */
  icon: IconType;
  /** Route path associated with this navigation item */
  route: string;
};

/**
 * Props for the SidebarButtons component.
 */
type SidebarButtonProps = NavigationItem & {
  /** Whether the sidebar is currently expanded */
  isExpanded: boolean;
  /** Click handler triggered when the button is clicked */
  onClick: () => void;
  /** Whether this button represents the active route */
  active: boolean;
};

/**
 * Defines the list of available navigation items for the sidebar.
 */
const navigationItems: NavigationItem[] = [
  { text: "Dashboard", route: "/dashboard", icon: RxDashboard },
  { text: "Calendar", route: "/calendar", icon: LuCalendar },
  { text: "Manage List", route: "/manage-list", icon: FiUsers },
  { text: "Settings", route: "/settings", icon: IoSettingsOutline },
];

/**
 * Renders a single button inside the sidebar.
 *
 * @param {SidebarButtonProps} props - Button properties including text, icon, and active state.
 * @returns {JSX.Element} Sidebar button component.
 */
const SidebarButtons = ({
  text,
  icon: Icon,
  onClick,
  isExpanded,
  active,
}: SidebarButtonProps) => {
  const conditionalStyles = isExpanded ? "hover:translate-x-1" : "";

  return (
    <button
      onClick={onClick}
      className={`rounded-md p-2 flex items-center gap-3 transition-all duration-300 ${conditionalStyles} 
        ${
          active
            ? "bg-gray-500 text-white"
            : "bg-black text-gray-300 hover:bg-gray-700 hover:cursor-grab"
        }`}
    >
      <div className="size-8 flex items-center justify-center shrink-0">
        <Icon size={28} />
      </div>

      {isExpanded && (
        <p
          className={`font-medium text-md overflow-hidden whitespace-nowrap transition-all duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          {text}
        </p>
      )}
    </button>
  );
};

/**
 * Sidebar component containing navigation links and a collapsible toggle.
 *
 * - Supports expand/collapse functionality.
 * - Uses Next.js router for client-side navigation.
 * - Highlights the active route.
 *
 * @returns {JSX.Element} Sidebar layout component.
 */
const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const conditionalSidebarStyles = expanded ? "w-64" : "w-16";

  return (
    <div
      className={`min-h-screen bg-black flex flex-col p-2 transition-all duration-300 ${conditionalSidebarStyles}`}
    >
      {/* Sidebar Header (hamburger toggle) */}
      <div
        className="mb-6 bg-black rounded-lg size-10 m-1 flex justify-center items-center hover:cursor-grab"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <GiHamburgerMenu color="white" size={24} />
      </div>

      {/* Sidebar Navigations */}
      <div className="flex flex-col gap-1">
        {navigationItems.map((item, index) => (
          <SidebarButtons
            key={index}
            text={item.text}
            icon={item.icon}
            isExpanded={expanded}
            onClick={() => item.route !== pathname && router.push(item.route)}
            active={pathname === item.route}
            route={item.route}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
