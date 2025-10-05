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
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
          ALL STUDENTS
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          Coming soon: list all students across college, senior high, and houses.
        </p>
      </div>
    );
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-neutral-100 px-6 py-12 text-neutral-900 md:px-10">
      {renderContent()}
    </section>
  );
};

export default ManageWhichPage;
