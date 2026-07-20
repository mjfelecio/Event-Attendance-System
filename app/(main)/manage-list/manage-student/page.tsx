import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Prisma,
  SchoolLevel,
  YearLevel,
} from "@prisma/client";

import ManageStudentClient from "@/features/manage-list/components/ManageStudentClient";
import type {
  ManageListCategory,
  ManageStudentContext,
  StudentFilterOptions,
  StudentFilterState,
  StudentSortDirection,
  StudentSortField,
  StudentTableState,
} from "@/features/manage-list/types";
import { mapStudentsToRows, slugify } from "@/features/manage-list/utils/mapStudentToRow";
import {
  COLLEGE_PROGRAMS,
  DEPARTMENTS,
  HOUSES,
  SHS_STRANDS,
} from "@/globals/constants/groups";
import { prisma } from "@/globals/libs/prisma";
import { getFreshAuthSession } from "@/globals/utils/auth";

type ManageStudentPageProps = {
  searchParams: Promise<ManageStudentContext>;
};

const PAGE_SIZES = [25, 50, 100] as const;
const COLLEGE_YEARS = [
  YearLevel.YEAR_1,
  YearLevel.YEAR_2,
  YearLevel.YEAR_3,
  YearLevel.YEAR_4,
];
const SHS_YEARS = [YearLevel.GRADE_11, YearLevel.GRADE_12];
const YEAR_LABELS: Record<YearLevel, string> = {
  YEAR_1: "1st Year",
  YEAR_2: "2nd Year",
  YEAR_3: "3rd Year",
  YEAR_4: "4th Year",
  GRADE_11: "11th Grade",
  GRADE_12: "12th Grade",
};
const YEAR_BY_LABEL = Object.fromEntries(
  Object.entries(YEAR_LABELS).map(([value, label]) => [label, value])
) as Record<string, YearLevel>;

const categoryLabels: Record<ManageListCategory, string> = {
  college: "College Department",
  shs: "Senior High Strand",
  house: "House",
  all: "All Students",
};

const validCategories = new Set<ManageListCategory>([
  "all",
  "college",
  "shs",
  "house",
]);
const validSortFields = new Set<StudentSortField>([
  "updatedAt",
  "lastName",
  "yearLevel",
]);
const validDirections = new Set<StudentSortDirection>(["asc", "desc"]);
const departmentNames = new Set(DEPARTMENTS.map((department) => department.name));
const programCodes = new Set([
  ...COLLEGE_PROGRAMS.map((program) => program.code),
  ...SHS_STRANDS.map((strand) => strand.code),
]);
const houseNames = new Set(HOUSES.map((house) => house.name));

const cleanText = (value: string | undefined, maxLength = 100) =>
  value?.trim().slice(0, maxLength) || undefined;

const parsePositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const buildContextWhere = (
  category: ManageListCategory,
  item?: string
): Prisma.StudentWhereInput => {
  if (category === "college") {
    return {
      schoolLevel: SchoolLevel.COLLEGE,
      yearLevel: { in: COLLEGE_YEARS },
      ...(item ? { departmentSlug: item } : {}),
    };
  }

  if (category === "shs") {
    const strand = item
      ? SHS_STRANDS.find((candidate) => slugify(candidate.code) === item)
      : undefined;

    return {
      schoolLevel: SchoolLevel.SHS,
      yearLevel: { in: SHS_YEARS },
      ...(item ? { shsStrand: strand?.code ?? "__invalid_strand__" } : {}),
    };
  }

  if (category === "house") {
    return item ? { houseSlug: item } : { house: { not: null } };
  }

  return {};
};

const buildStudentWhere = (
  baseWhere: Prisma.StudentWhereInput,
  search: string,
  filters: StudentFilterState,
  includeSection = true
): Prisma.StudentWhereInput => {
  const and: Prisma.StudentWhereInput[] = [baseWhere];

  if (search) {
    and.push({
      OR: [
        { id: { contains: search } },
        { firstName: { contains: search } },
        { middleName: { contains: search } },
        { lastName: { contains: search } },
        { collegeProgram: { contains: search } },
        { shsStrand: { contains: search } },
        { department: { contains: search } },
        { house: { contains: search } },
        { section: { contains: search } },
      ],
    });
  }

  if (filters.department !== "all") {
    and.push({ department: filters.department });
  }
  if (filters.program !== "all") {
    and.push({
      OR: [
        { collegeProgram: filters.program },
        { shsStrand: filters.program },
      ],
    });
  }
  if (filters.house !== "all") {
    and.push({ house: filters.house });
  }
  if (includeSection && filters.section !== "all") {
    and.push({ section: filters.section });
  }
  if (filters.level !== "all") {
    and.push({ yearLevel: YEAR_BY_LABEL[filters.level] });
  }

  return { AND: and };
};

const buildOrderBy = (
  field: StudentSortField,
  direction: StudentSortDirection
): Prisma.StudentOrderByWithRelationInput[] => {
  if (field === "lastName") {
    return [
      { lastName: direction },
      { firstName: direction },
      { id: direction },
    ];
  }

  if (field === "yearLevel") {
    // COLLEGE sorts before SHS in ascending order, matching the previous
    // client-side 1st..4th Year, then Grade 11..12 ordering.
    return [
      { schoolLevel: direction },
      { yearLevel: direction },
      { lastName: direction },
      { firstName: direction },
      { id: direction },
    ];
  }

  return [{ updatedAt: direction }, { id: direction }];
};

const ManageStudentPage = async ({ searchParams }: ManageStudentPageProps) => {
  // This page fetches student PII during server rendering, so authorization
  // must happen before any roster query.
  const session = await getFreshAuthSession();
  if (!session || session.status !== "ACTIVE") {
    redirect("/login");
  }

  const params = await searchParams;
  const requestedCategory = cleanText(params.category) as
    | ManageListCategory
    | undefined;
  const category =
    requestedCategory && validCategories.has(requestedCategory)
      ? requestedCategory
      : "all";
  const label = cleanText(params.label);
  const item = cleanText(params.item);
  const search = cleanText(params.q) ?? "";
  const requestedSort = cleanText(params.sort) as StudentSortField | undefined;
  const sortField =
    requestedSort && validSortFields.has(requestedSort)
      ? requestedSort
      : "updatedAt";
  const requestedDirection = cleanText(params.direction) as
    | StudentSortDirection
    | undefined;
  const sortDirection =
    requestedDirection && validDirections.has(requestedDirection)
      ? requestedDirection
      : "desc";

  const requestedPageSize = parsePositiveInteger(params.pageSize, 25);
  const pageSize = PAGE_SIZES.includes(
    requestedPageSize as (typeof PAGE_SIZES)[number]
  )
    ? requestedPageSize
    : 25;
  const requestedPage = parsePositiveInteger(params.page, 1);

  const department = cleanText(params.department);
  const program = cleanText(params.program);
  const house = cleanText(params.house);
  const section = cleanText(params.section);
  const level = cleanText(params.level);
  const filters: StudentFilterState = {
    department:
      department && departmentNames.has(department) ? department : "all",
    program: program && programCodes.has(program) ? program : "all",
    house: house && houseNames.has(house) ? house : "all",
    section: section ?? "all",
    level: level && YEAR_BY_LABEL[level] ? level : "all",
  };

  const baseWhere = buildContextWhere(category, item);
  const where = buildStudentWhere(baseWhere, search, filters);
  const sectionFacetWhere = buildStudentWhere(
    baseWhere,
    "",
    filters,
    false
  );

  const [selectionTotal, totalRows, sectionRows] = await Promise.all([
    prisma.student.count({ where: baseWhere }),
    prisma.student.count({ where }),
    prisma.student.findMany({
      where: sectionFacetWhere,
      select: { section: true },
      distinct: ["section"],
      orderBy: { section: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const page = Math.min(requestedPage, totalPages);

  if (requestedPage !== page) {
    const canonicalParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && value) {
        canonicalParams.set(key, value);
      }
    }
    if (page === 1) {
      canonicalParams.delete("page");
    } else {
      canonicalParams.set("page", String(page));
    }
    const canonicalQuery = canonicalParams.toString();
    redirect(
      canonicalQuery
        ? `/manage-list/manage-student?${canonicalQuery}`
        : "/manage-list/manage-student"
    );
  }

  const students = await prisma.student.findMany({
    where,
    orderBy: buildOrderBy(sortField, sortDirection),
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const selectedDepartment =
    filters.department === "all"
      ? undefined
      : DEPARTMENTS.find((candidate) => candidate.name === filters.department);
  const collegeProgramOptions = COLLEGE_PROGRAMS.filter(
    (candidate) =>
      !selectedDepartment ||
      candidate.departmentSlug === selectedDepartment.slug
  ).map((candidate) => candidate.code);
  const shsProgramOptions = SHS_STRANDS.map((candidate) => candidate.code);
  const filterOptions: StudentFilterOptions = {
    departments:
      category === "shs" ? [] : DEPARTMENTS.map((candidate) => candidate.name),
    programs:
      category === "college"
        ? collegeProgramOptions
        : category === "shs"
          ? shsProgramOptions
          : [...collegeProgramOptions, ...shsProgramOptions],
    sections: sectionRows.map((row) => row.section),
    levels:
      category === "college"
        ? COLLEGE_YEARS.map((year) => YEAR_LABELS[year])
        : category === "shs"
          ? SHS_YEARS.map((year) => YEAR_LABELS[year])
          : [...COLLEGE_YEARS, ...SHS_YEARS].map(
              (year) => YEAR_LABELS[year]
            ),
    houses: category === "shs" ? [] : HOUSES.map((candidate) => candidate.name),
  };
  const tableState: StudentTableState = {
    search,
    sortField,
    sortDirection,
    filters,
  };
  const backHref =
    category === "all"
      ? "/manage-list"
      : `/manage-list/manage-which?type=${category}`;

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
          key={`${category}:${item ?? ""}:${label ?? ""}`}
          label={label}
          item={item}
          categoryHeading={categoryLabels[category]}
          rows={mapStudentsToRows(students)}
          tableState={tableState}
          filterOptions={filterOptions}
          pagination={{
            page,
            pageSize,
            totalRows,
            selectionTotal,
            totalPages,
          }}
        />
      </div>
    </section>
  );
};

export default ManageStudentPage;
