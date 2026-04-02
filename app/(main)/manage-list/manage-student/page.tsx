"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStudentsV2 } from "@/globals/hooks/useStudents";
import ManageStudentClient from "@/features/manage-list/components/ManageStudentClient";
import { ManageListCategory } from "@/features/manage-list/types";

const CATEGORY_CONFIG: Record<
  ManageListCategory,
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

const ManageStudentPage = () => {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  // Data fetching using our V2 hook (server-side filtered)
  const { data: students, isLoading } = useStudentsV2(filters);

  // Derive Category State
  const category = (filters?.category as ManageListCategory) || "ALL";
  const config = CATEGORY_CONFIG[category];

  // Dynamically extract the "item" slug based on the category's specific query key
  const itemSlug = config.queryKey
    ? (filters[config.queryKey] as string)
    : undefined;

  const backHref =
    category === "ALL"
      ? "/manage-list"
      : `/manage-list/manage-which?category=${category}`;

  return (
    <section className="flex flex-1 justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="flex w-full max-w-[1600px] flex-col gap-6">
        <div className="px-6 md:px-12">
          <Link
            href={backHref}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
          >
            <span className="mr-2">←</span> Back to selection
          </Link>
        </div>

        <ManageStudentClient
          category={category}
          label={config.label}
          item={itemSlug || "General"}
          categoryHeading={config.heading}
          rows={[]}
        />
      </div>
    </section>
  );
};

export default ManageStudentPage;
