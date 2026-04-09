import { Inbox, SearchX, XCircle } from "lucide-react";

/**
 * DataTableEmptyState
 * Used when the database/collection is genuinely empty.
 */
export const DataTableEmptyState = ({
  title = "No data available",
  description = "There are no records to display at the moment.",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-50 p-4">
        <Inbox className="size-8 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-xs">{description}</p>
    </div>
  );
};

/**
 * DataTableFilteredEmptyState
 * Used when search or filters return zero matches.
 */
export const DataTableFilteredEmptyState = ({
  onClear,
}: {
  onClear?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-indigo-50 p-4">
        <SearchX className="size-8 text-indigo-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">
        No matching results
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        We couldn't find what you're looking for. Try a different search term.
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <XCircle className="size-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
};

/**
 * DataTableSkeleton
 * Preserves the table structure with a header row and body rows.
 */
export const DataTableSkeleton = ({
  rows = 6,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <>
      <div className="flex flex-col gap-3 p-4 pb-2">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-8 flex-1 rounded bg-gray-200/50 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-6 flex-1 rounded bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
