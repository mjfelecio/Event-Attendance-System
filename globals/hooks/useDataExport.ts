import { useCallback, useState } from "react";
import { fetchApi } from "@/globals/utils/api";
import { jsonToCSV } from "react-papaparse";

type ExportFormat = "csv";

type UseDataExportParams<T> = {
  /** API endpoint to fetch export data from */
  apiUrl: string;
  /** Filename without extension */
  filename: string;
};

type UseDataExportResult = {
  isExporting: boolean;
  exportData: () => Promise<void>;
};

/**
 * Prevents CSV formula injection: values starting with = + - @ (or tab/CR)
 * would execute as formulas when the file is opened in Excel/Sheets.
 */
function escapeCsvFormulas<T>(rows: T[]): T[] {
  const dangerous = /^[=+\-@\t\r]/;
  return rows.map((row) => {
    if (!row || typeof row !== "object") return row;
    const safe: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      safe[key] =
        typeof value === "string" && dangerous.test(value)
          ? `'${value}`
          : value;
    }
    return safe as T;
  });
}

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function useDataExport<T>({
  apiUrl,
  filename,
}: UseDataExportParams<T>): UseDataExportResult {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = useCallback(async () => {
    try {
      setIsExporting(true);

      const response = await fetchApi<T[]>(apiUrl);

      const csv = jsonToCSV(escapeCsvFormulas(response));
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const datedFilename = `${filename}_${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

      downloadFile(blob, datedFilename);
    } finally {
      setIsExporting(false);
    }
  }, [apiUrl, filename]);

  return { isExporting, exportData };
}
