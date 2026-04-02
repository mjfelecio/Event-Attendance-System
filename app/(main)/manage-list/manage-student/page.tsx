"use client";

import Link from "next/link";
import { ManageListCategory } from "@/features/manage-list/types";
import { useSearchParams } from "next/navigation";
import { useStudentsV2 } from "@/globals/hooks/useStudents";
import { useEffect, useState } from "react";

const CATEGORY_LABELS: Record<ManageListCategory, string> = {
  COLLEGE: "College Department",
  SHS: "Senior High Strand",
  HOUSE: "House",
  ALL: "All Students",
};

const ManageStudentPage = () => {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());

  const { data: students } = useStudentsV2(filters);

  const category = filters?.category as ManageListCategory
  const label = CATEGORY_LABELS[category] ?? ""
  const backHref =
    filters?.category === "ALL"
      ? "/manage-list"
      : `/manage-list/manage-which?category=${filters?.category}`;

  // const studentRows = mapStudentsToRows(students);
  // const baseRows = filterByContext(studentRows, category, item);

  return (
    <section className="flex flex-1 justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="flex w-full max-w-[1600px] flex-col gap-6">
        <div className="px-6 md:px-12">
          <Link
            href={backHref}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
          >
            {"<"} Back to selection
          </Link>
        </div>

        {/* <ManageStudentClient
          category={category}
          label={label}
          item={item}
          categoryHeading={categoryLabels[category] ?? categoryLabels.all}
          rows={baseRows}
        /> */}
      </div>
    </section>
  );
};

export default ManageStudentPage;
