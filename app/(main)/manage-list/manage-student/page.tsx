import Link from "next/link";
import StudentTable from "@/features/manage-list/components/StudentTable";
import {
  ManageStudentContext,
  StudentRow,
} from "@/features/manage-list/types";

type ManageStudentPageProps = {
  searchParams: ManageStudentContext;
};

const categoryLabels: Record<ManageStudentContext["category"], string> = {
  college: "College Department",
  shs: "Senior High Strand",
  house: "House",
  all: "All Students",
};

const ManageStudentPage = ({ searchParams }: ManageStudentPageProps) => {
  const { category = "all", label, item } = searchParams;

  const filteredRows = MOCK_STUDENTS.filter((student) => {
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

        <header className="px-6 text-center md:px-12">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
            {categoryLabels[category]}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-800 md:text-4xl">
            {label ?? "Manage Students"}
          </h1>
          {item && (
            <p className="mt-2 text-xs uppercase tracking-[0.4em] text-neutral-400">
              {item}
            </p>
          )}
        </header>

        <div className="px-0 md:px-4">
          <StudentTable rows={filteredRows} />
        </div>
      </div>
    </section>
  );
};

export default ManageStudentPage;

const MOCK_STUDENTS: StudentRow[] = [
  {
    studentNumber: "22902391024822",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Giallio",
    houseSlug: "giallio",
    section: "1B",
    yearLevelLabel: "1st Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    contactNumber: "0917-123-4567",
    updatedAt: "2025-09-18",
  },
  {
    studentNumber: "21902391024823",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSIT",
    programSlug: "bsit",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Kahel",
    houseSlug: "kahel",
    section: "Grass",
    yearLevelLabel: "12th Grade",
    schoolLevel: "SHS",
    status: "ACTIVE",
    updatedAt: "2025-09-15",
  },
  {
    studentNumber: "2902391024824",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Kahel",
    houseSlug: "kahel",
    section: "2C",
    yearLevelLabel: "2nd Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    updatedAt: "2025-08-21",
  },
  {
    studentNumber: "21902391024825",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Giallio",
    houseSlug: "giallio",
    section: "Eggplant",
    yearLevelLabel: "11th Grade",
    schoolLevel: "SHS",
    status: "ACTIVE",
    updatedAt: "2025-09-05",
  },
  {
    studentNumber: "21902391024826",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Azul",
    houseSlug: "azul",
    section: "1A",
    yearLevelLabel: "1st Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    updatedAt: "2025-07-30",
  },
  {
    studentNumber: "21902391024827",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Roxxo",
    houseSlug: "roxxo",
    section: "1A",
    yearLevelLabel: "1st Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    updatedAt: "2025-09-20",
  },
  {
    studentNumber: "21902391024828",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSIT",
    programSlug: "bsit",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Kahel",
    houseSlug: "kahel",
    section: "3B",
    yearLevelLabel: "3rd Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    updatedAt: "2025-08-11",
  },
  {
    studentNumber: "21902391024829",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSIT",
    programSlug: "bsit",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Kahel",
    houseSlug: "kahel",
    section: "Meow",
    yearLevelLabel: "12th Grade",
    schoolLevel: "SHS",
    status: "ACTIVE",
    updatedAt: "2025-09-10",
  },
  {
    studentNumber: "21902391024830",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Roxxo",
    houseSlug: "roxxo",
    section: "CSGO",
    yearLevelLabel: "2st Year",
    schoolLevel: "COLLEGE",
    status: "ACTIVE",
    updatedAt: "2025-09-02",
  },
  {
    studentNumber: "21902391024831",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSIT",
    programSlug: "bsit",
    department: "CS",
    departmentSlug: "computer-studies",
    house: "Giallio",
    houseSlug: "giallio",
    section: "A:",
    yearLevelLabel: "11th Grade",
    schoolLevel: "SHS",
    status: "ACTIVE",
    updatedAt: "2025-09-22",
  },
  {
    studentNumber: "21902391024832",
    lastName: "Gasacao",
    firstName: "John Ashly",
    middleName: "Otleng",
    program: "BSCS",
    programSlug: "bscs",
    department: "CS",
    departmentSlug: "computer-s",
    house: "Roxxo",
    houseSlug: "roxxo",
    section: "Indians",
    yearLevelLabel: "12th Grade",
    schoolLevel: "SHS",
    status: "ACTIVE",
    updatedAt: "2025-09-27",
  },
];
  