import { GraduationCap, User, Users2 } from "lucide-react";
import { Step } from ".";
import React from "react";

const StepIndicator = ({ current }: { current: Step }) => {
  const steps: { key: Step; icon: any }[] = [
    { key: "personal", icon: User },
    { key: "academic", icon: GraduationCap },
    { key: "groups", icon: Users2 },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = current === s.key;
        return (
          <React.Fragment key={s.key}>
            <div className={`p-1.5 rounded-md ${isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
              <Icon size={14} />
            </div>
            {i < steps.length - 1 && <div className="w-4 h-px bg-slate-200" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;