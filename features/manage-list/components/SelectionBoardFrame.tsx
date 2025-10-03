import { ReactNode } from "react";

interface SelectionBoardFrameProps {
  children: ReactNode;
}

const SelectionBoardFrame = ({ children }: SelectionBoardFrameProps) => {
  return (
    <div className="w-full rounded-[2.5rem] border border-neutral-300 bg-white px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:px-14 md:py-12">
      {children}
    </div>
  );
};

export default SelectionBoardFrame;
