import CollegeSelectionBoard from "@/features/students/components/CollegeSelectionBoard";
import HouseSelectionBoard from "@/features/students/components/HouseSelectionBoard";
import ShsSelectionBoard from "@/features/students/components/ShsSelectionBoard";
import { StudentListCategory } from "@/features/students/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    category?: StudentListCategory;
  }>;
};

const SelectCategoryPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const category = params.category ?? "COLLEGE";

  const renderContent = () => {
    if (category === "COLLEGE") return <CollegeSelectionBoard />;
    if (category === "SHS") return <ShsSelectionBoard />;
    if (category === "HOUSE") return <HouseSelectionBoard />;

    return redirect("/students/student-list?category=ALL");
  };

  return (
    <section className="relative flex min-h-screen flex-1 flex-col items-center bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-12">
      <div className="flex w-full max-w-6xl flex-col gap-8">
        {/* Navigation Header */}
        <div className="flex items-center">
          <Link
            href="/students"
            className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-md"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Menu</span>
          </Link>
        </div>

        {/* Selection Content */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default SelectCategoryPage;
