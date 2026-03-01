import { ReactNode } from "react";

interface SelectionBoardFrameProps {
  children: ReactNode;
}

const SelectionBoardFrame = ({ children }: SelectionBoardFrameProps) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_58%)]" />
      <div className="relative">{children}</div>
    </div>
  );
};

export default SelectionBoardFrame;
