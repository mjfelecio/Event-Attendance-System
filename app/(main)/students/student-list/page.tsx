"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetchStudents } from "@/globals/hooks/useStudents";
import StudentListClient from "@/features/students/components/StudentListClient";
import { StudentListCategory } from "@/features/students/types";

const CATEGORY_CONFIG: Record<
  StudentListCategory,
  {
    label: string;
    heading: string;
    queryKey?: string; // The key used in searchParams (e.g., 'department')
  }
> = {
  COLLEGE: {
    label: "College Department",
    heading: "College Rosters",
    queryKey: "department",
  },
  SHS: {
    label: "Senior High Strand",
    heading: "SHS Rosters",
    queryKey: "strand",
  },
  HOUSE: {
    label: "House",
    heading: "House Rosters",
    queryKey: "house",
  },
  ALL: {
    label: "All Students",
    heading: "Main Student Directory",
  },
};

const StudentListPage = () => {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  // Derive Category State. Fall back to ALL for unknown categories so a
  // crafted ?category=... can't crash on an undefined config.
  const rawCategory = filters?.category as string | undefined;
  const isKnownCategory = !!rawCategory && rawCategory in CATEGORY_CONFIG;
  const category: StudentListCategory = isKnownCategory
    ? (rawCategory as StudentListCategory)
    : "ALL";
  const config = CATEGORY_CONFIG[category];

  // When the category is unknown we truly fall back to the ALL roster, so drop
  // the other raw filters too - otherwise ?category=invalid&house=azul would
  // claim "All Students" while still returning only Azul. A valid/absent
  // category keeps its filters.
  const queryFilters =
    rawCategory && !isKnownCategory
      ? { category: "ALL" }
      : { ...filters, category };
  const { data: students, isLoading, isError } = useFetchStudents(queryFilters);

  // Dynamically extract the "item" slug based on the category's specific query key
  const itemSlug = config.queryKey
    ? (filters[config.queryKey] as string)
    : undefined; 

  const backHref =
    category === "ALL"
      ? "/students"
      : `/students/select-category?category=${category}`;

  return (
    <section className="flex flex-1 justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center w-fit rounded-full border border-slate-200 bg-white py-2 px-6 md:px-12 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
        >
          <span className="mr-2">←</span> Back to selection
        </Link>

        <StudentListClient
          category={category}
          label={config.label}
          item={itemSlug || "General"}
          categoryHeading={config.heading}
          students={students ?? []}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </section>
  );
};

export default StudentListPage;
