"use client";

import React, { useState } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  X, 
  Download,
  AlertCircle,
  Database
} from "lucide-react";
import { Button } from "@/globals/components/shad-cn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/globals/components/shad-cn/card";
// import { Alert, AlertDescription, AlertTitle } from "@/globals/components/shad-cn/alert";
import { Badge } from "@/globals/components/shad-cn/badge";

const ImportStudentPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleImport = () => {
    setIsProcessing(true);
    // Implementation for Prisma Upsert logic would go here
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Import Student Records</h1>
          <p className="text-muted-foreground text-sm">
            Bulk upload student informations
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          asChild
        >
          <a
            href="/templates/student-format.xlsx"
            download="student_import_template.xlsx"
          >
            <Download className="w-4 h-4" />
            Excel Template
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar: Schema Mapping Info */}
        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Required Fields
            </h3>
            <div className="flex flex-wrap gap-2">
              {["id", "lastName", "firstName", "section", "yearLevel", "schoolLevel"].map((field) => (
                <Badge key={field} variant="default" className="font-mono text-[10px]">
                  {field}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> Conditional Rules
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
              <li><strong>SHS:</strong> Requires <code className="text-primary">shsStrand</code></li>
              <li><strong>College:</strong> Requires <code className="text-primary">collegeProgram</code></li>
              <li>New IDs will create records; existing IDs will be updated (Upsert).</li>
            </ul>
          </section>
        </div>

        {/* Main Upload Area */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Data Source</CardTitle>
            <CardDescription>Select a .csv or .xlsx file containing the student masterlist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!file ? (
              <div className="relative group border-2 border-dashed rounded-xl p-12 transition-colors hover:bg-muted/50 flex flex-col items-center justify-center space-y-4 cursor-pointer">
                <div className="p-4 bg-primary/5 rounded-full text-primary">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Drop file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1 text-balance">
                    Supported formats: CSV, XLSX (Max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-xl bg-primary/5 border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg border shadow-sm text-primary">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB • Ready for Validation
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* <Alert className="bg-muted/50 border-none">
              <Users className="h-4 w-4" />
              <AlertTitle className="text-xs font-bold uppercase tracking-wider">Note on Department Mapping</AlertTitle>
              <AlertDescription className="text-xs">
                Slugs (e.g., <code className="text-primary">cite-dept</code>) are automatically generated if not provided in the upload.
              </AlertDescription>
            </Alert> */}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-muted/20 border-t p-4">
            <Button variant="ghost" disabled={!file || isProcessing} onClick={() => setFile(null)}>
              Reset
            </Button>
            <Button disabled={!file || isProcessing} onClick={handleImport} className="min-w-[140px]">
              {isProcessing ? "Importing..." : "Execute Import"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ImportStudentPage;