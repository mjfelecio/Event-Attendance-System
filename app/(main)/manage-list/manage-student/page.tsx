import Link from "next/link";
import { ManageStudentContext } from "@/features/manage-list/types";

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

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-1 justify-center bg-neutral-100 px-6 py-12 text-neutral-900 md:px-10">
      <div className="flex w-full max-w-5xl flex-col gap-10">
        <div>
          <Link
            href="/manage-list/manage-which"
            className="text-sm font-medium text-neutral-500 transition hover:text-neutral-700"
          >
            ← Back to selection
          </Link>
        </div>

        <header className="text-center">
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

        <div className="rounded-[2rem] border border-neutral-300 bg-white px-8 py-12 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-neutral-500">
            Student records for <span className="font-semibold text-neutral-700">{label ?? "this selection"}</span> will appear here.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-neutral-400">
            Coming soon
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManageStudentPage;
