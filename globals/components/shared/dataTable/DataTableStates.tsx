/**
 * DataTableEmptyState
 *
 * Shown when the table has no data to display.
 */
export const DataTableEmptyState = ({
  title = "No data available",
  description = "There are no records to display at the moment.",
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-2">
      <p className="text-lg font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-500 max-w-sm">{description}</p>
    </div>
  );
};

/**
 * DataTableFilteredEmptyState
 *
 * Shown when filters or search return no matching results.
 */
export const DataTableFilteredEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-2">
      <p className="text-lg font-medium text-gray-700">
        No matching results
      </p>
      <p className="text-sm text-gray-500">
        Try adjusting or clearing your filters.
      </p>
    </div>
  );
};

/**
 * DataTableSkeleton
 *
 * Displays a placeholder table layout while data is loading.
 * Mimics rows and columns to preserve layout stability.
 */
export const DataTableSkeleton = ({ rows = 6, columns = 4 }: {
  rows?: number;
  columns?: number;
}) => {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-6 flex-1 rounded bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
};