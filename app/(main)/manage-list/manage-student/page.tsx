import Link from "next/link";
import ManageStudentClient from "@/features/manage-list/components/ManageStudentClient";
import { mapStudentsToRows } from "@/features/manage-list/utils/mapStudentToRow";
import { ManageStudentContext, StudentRow } from "@/features/manage-list/types";
import { prisma } from "@/globals/libs/prisma";

type ManageStudentPageProps = {
  searchParams: ManageStudentContext;
};

const categoryLabels: Record<ManageStudentContext["category"], string> = {
  college: "College Department",
  shs: "Senior High Strand",
  house: "House",
  all: "All Students",
};

const filterByContext = (
  rows: StudentRow[],
  category: ManageStudentContext["category"],
  item?: string
) => {
  return rows.filter((student) => {
    if (category === "all") {
      return true;
    }

    if (category === "college") {
      if (item) {
        return student.departmentSlug === item;
      }
      return student.schoolLevel === "COLLEGE";
    }

    if (category === "shs") {
      if (item) {
        return student.programSlug === item;
      }
      return student.schoolLevel === "SHS";
    }

    if (category === "house") {
      if (item) {
        return student.houseSlug === item;
      }
      return Boolean(student.house);
    }

    return true;
  });
};

const ManageStudentPage = async ({ searchParams }: ManageStudentPageProps) => {
  const params = await Promise.resolve(searchParams ?? {});
  const { category = "all", label, item } = params;
  const backHref =
    category === "all"
      ? "/manage-list"
      : `/manage-list/manage-which?type=${category}`;

  const students = await prisma.student.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const studentRows = mapStudentsToRows(students);
  const baseRows = filterByContext(studentRows, category, item);

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

        <ManageStudentClient
          category={category}
          label={label}
          item={item}
          categoryHeading={categoryLabels[category] ?? categoryLabels.all}
          rows={baseRows}
        />
      </div>
    </section>
  );
};

export default ManageStudentPage;
