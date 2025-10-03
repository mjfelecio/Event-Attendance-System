import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import { SHS_STRANDS } from "@/features/manage-list/constants/categories";

const ShsSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
        WHICH STRAND?
      </h1>

      <SelectionBoardFrame>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Academics
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHS_STRANDS.academics.map((strand) => (
                <button
                  key={strand}
                  type="button"
                  className="rounded-[1.25rem] border border-neutral-300 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-neutral-700 transition hover:-translate-y-1 hover:border-neutral-400 hover:text-neutral-900"
                >
                  {strand}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Technical Vocational Livelihood
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHS_STRANDS.tvl.map((strand) => (
                <button
                  key={strand}
                  type="button"
                  className="rounded-[1.25rem] border border-neutral-300 px-6 py-4 text-sm font-semibold uppercase tracking-widest text-neutral-700 transition hover:-translate-y-1 hover:border-neutral-400 hover:text-neutral-900"
                >
                  {strand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default ShsSelectionBoard;
