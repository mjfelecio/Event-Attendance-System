import { redirect } from "next/navigation";
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

  // "All students" has no sub-selection - go straight to the (now real)
  // paginated all-students roster instead of a "coming soon" dead end.
  if (type === "all") {
    redirect("/manage-list/manage-student?category=all");
  }

  const renderContent = () => {
    if (type === "college") return <CollegeSelectionBoard />;
    if (type === "shs") return <ShsSelectionBoard />;
    if (type === "house") return <HouseSelectionBoard />;

    return <CollegeSelectionBoard />;
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="w-full max-w-6xl">{renderContent()}</div>
    </section>
  );
};

export default ManageWhichPage;
