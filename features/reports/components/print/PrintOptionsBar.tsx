"use client";

import { Printer } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Switch } from "@/globals/components/shad-cn/switch";
import { Label } from "@/globals/components/shad-cn/label";
import { pill } from "@/globals/constants/designTokens";

type Toggle = {
  key: string;
  label: string;
  /** What the option is when the parameter is absent. */
  defaultOn: boolean;
};

const TOGGLES: Toggle[] = [
  { key: "absentees", label: "Include absentees", defaultOn: true },
  { key: "grouped", label: "Group by section", defaultOn: true },
  { key: "signature", label: "Signature column", defaultOn: true },
];

/**
 * On-screen controls for the printable sheet. Never printed (`.no-print`).
 *
 * Options live in the URL rather than in React state so the page itself can stay
 * a server component — it reads `searchParams` and renders the finished document,
 * with no report logic shipped to the browser. It also makes a particular
 * configuration a shareable, bookmarkable link.
 */
const PrintOptionsBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isOn = (toggle: Toggle) => {
    const value = searchParams.get(toggle.key);
    if (value === null) return toggle.defaultOn;
    return value === "1";
  };

  const setToggle = (toggle: Toggle, next: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    // Keep the URL clean: only record a value when it differs from the default.
    if (next === toggle.defaultOn) params.delete(toggle.key);
    else params.set(toggle.key, next ? "1" : "0");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className="no-print sticky top-0 z-10 mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
      {TOGGLES.map((toggle) => (
        <div key={toggle.key} className="flex items-center gap-2">
          <Switch
            id={`print-${toggle.key}`}
            checked={isOn(toggle)}
            onCheckedChange={(next) => setToggle(toggle, next)}
          />
          <Label htmlFor={`print-${toggle.key}`} className="text-sm text-slate-600">
            {toggle.label}
          </Label>
        </div>
      ))}

      <button
        type="button"
        onClick={() => window.print()}
        className={`${pill.primary} ml-auto`}
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </div>
  );
};

export default PrintOptionsBar;
