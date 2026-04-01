"use client";

import { useState } from "react";
import { useCSVReader, formatFileSize } from "react-papaparse";
import { Upload, FileSpreadsheet, X, Loader2, Users } from "lucide-react";
import { Button } from "@/globals/components/shad-cn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/globals/components/shad-cn/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/globals/components/shad-cn/alert";
import { toastDanger, toastSuccess } from "@/globals/components/shared/toasts";

type Props = {
  onImportSuccess: (count: number) => void;
};

export default function StudentImporter({ onImportSuccess }: Props) {
  const { CSVReader } = useCSVReader();
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<any[] | null>(null);

  const handleImport = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/bulk-import/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();

      if (response.ok) {
        toastSuccess(data.message);
        onImportSuccess(data.count);
        setParsedData(null);
      } else {
        toastDanger(data.message || "Bulk import failed.");
      }
    } catch (error) {
      toastDanger("Network error during bulk import.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CSVReader
      config={{
        header: true,
        skipEmptyLines: true,
      }}
      onUploadAccepted={(results: any) => {
        setParsedData(results.data);
      }}
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
      }: any) => (
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Data Source</CardTitle>
            <CardDescription>
              Select a .csv file containing the student masterlist.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!acceptedFile ? (
              <div
                {...getRootProps()}
                className="relative group border-2 border-dashed rounded-xl p-12 transition-colors hover:bg-muted/50 flex flex-col items-center justify-center space-y-4 cursor-pointer"
              >
                <div className="p-4 bg-primary/5 rounded-full text-primary">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">
                    Supported formats: CSV (Max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-primary/5 border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg border shadow-sm text-primary">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{acceptedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(acceptedFile.size)} • Ready for
                        Validation
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    {...getRemoveFileProps()}
                    onClick={(e: any) => {
                      getRemoveFileProps().onClick(e);
                      setParsedData(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="h-1 px-1">
                  <ProgressBar />
                </div>
              </div>
            )}

            <Alert className="bg-muted/50 border-none">
              <Users className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wider">
                Note on Department Mapping
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Slugs (e.g., <code className="text-primary">cite-dept</code>)
                are automatically generated if not provided in the upload.
              </AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 bg-muted/20 border-t p-4">
            <Button
              variant="ghost"
              disabled={!acceptedFile || isProcessing}
              {...getRemoveFileProps()}
              onClick={(e: any) => {
                getRemoveFileProps().onClick(e);
                setParsedData(null);
              }}
            >
              Reset
            </Button>
            <Button
              disabled={!acceptedFile || isProcessing}
              onClick={handleImport}
              className="min-w-[140px]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Execute Import"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </CSVReader>
  );
}
