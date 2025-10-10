import Image from "next/image";
import Link from "next/link";
import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import { COLLEGE_DEPARTMENTS } from "@/features/manage-list/constants/categories";

const CollegeSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
        WHICH DEPARTMENT?
      </h1>
      <SelectionBoardFrame>
        <div className="grid gap-8 md:grid-cols-3">
          {COLLEGE_DEPARTMENTS.map((dept) => (
            <Link
              key={dept.title}
              href={{
                pathname: "/manage-list/manage-student",
                query: {
                  category: "college",
                  item: dept.slug,
                  label: dept.title,
                },
              }}
              className="group flex h-[300px] flex-col items-center justify-center gap-8 rounded-[2.25rem] border border-neutral-300 bg-white px-10 shadow-sm transition hover:-translate-y-1 hover:border-neutral-400 hover:shadow-md"
            >
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <Image
                    src={dept.logo}
                    alt={`${dept.abbreviation} logo`}
                    fill
                    sizes="14rem"
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-lg font-semibold text-neutral-800">
                  {dept.title}
                </p>
                <p className="text-sm uppercase tracking-wide text-neutral-500">
                  {dept.abbreviation}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default CollegeSelectionBoard;
