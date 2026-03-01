import CollegeSelectionBoard from "@/features/manage-list/components/CollegeSelectionBoard";
import HouseSelectionBoard from "@/features/manage-list/components/HouseSelectionBoard";
import ShsSelectionBoard from "@/features/manage-list/components/ShsSelectionBoard";
import { ManageListCategory } from "@/features/manage-list/types";

type ManageWhichPageProps = {
  searchParams: Promise<{
    type?: ManageListCategory;
  }>;
};

const ManageWhichPage = async ({ searchParams }: ManageWhichPageProps) => {
  const params = await searchParams;
  const type = params.type ?? "college";

  const renderContent = () => {
    if (type === "college") return <CollegeSelectionBoard />;
    if (type === "shs") return <ShsSelectionBoard />;
    if (type === "house") return <HouseSelectionBoard />;

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          ALL STUDENTS
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Coming soon: list all students across college, senior high, and houses.
        </p>
      </div>
    );
  };

  return (
    <section className="flex flex-1 justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="w-full max-w-6xl">{renderContent()}</div>
    </section>
  );
};

export default ManageWhichPage;
