import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import { COLLEGE_DEPARTMENTS } from "@/features/manage-list/constants/categories";

const CollegeSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
        WHICH DEPARTMENT?
      </h1>

      <SelectionBoardFrame>
        <div className="grid gap-8 md:grid-cols-3">
          {COLLEGE_DEPARTMENTS.map((dept) => (
            <button
              key={dept.title}
              type="button"
              className="group flex h-[230px] flex-col items-center justify-center gap-5 rounded-[2.25rem] border border-neutral-300 bg-white px-8 shadow-sm transition hover:-translate-y-1 hover:border-neutral-400 hover:shadow-md"
            >
              <div className="flex size-32 items-center justify-center rounded-full border-2 border-neutral-300 bg-neutral-50 text-sm font-semibold uppercase tracking-[0.4em] text-neutral-500 transition group-hover:border-neutral-400">
                Logo
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-semibold text-neutral-800">
                  {dept.title}
                </p>
                <p className="text-sm uppercase tracking-wide text-neutral-500">
                  {dept.abbreviation}
                </p>
              </div>
            </button>
          ))}
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default CollegeSelectionBoard;
