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

  const students = await prisma.student.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  const studentRows = mapStudentsToRows(students);
  const baseRows = filterByContext(studentRows, category, item);

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-1 justify-center bg-neutral-100 px-0 py-12 text-neutral-900 md:px-0">
      <div className="flex w-full flex-col gap-8">
        <div className="px-6 md:px-12">
          <Link
            href="/manage-list/manage-which"
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-700"
          >
            ← Back to selection
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