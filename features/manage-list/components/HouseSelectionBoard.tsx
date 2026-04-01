import Image from "next/image";
import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import Link from "next/link";
import { HOUSES } from "@/features/manage-list/constants/categories";

const HouseSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col gap-6 text-center">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          House Selection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Which House?
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Pick a house to view its members.
        </p>
      </header>

      <SelectionBoardFrame>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {HOUSES.map((house) => (
            <Link
              key={house.slug}
              href={{
                pathname: "/manage-list/manage-student",
                query: {
                  category: "house",
                  item: house.slug,
                  label: house.name,
                },
              }}
              className="group relative flex min-h-[250px] w-full max-w-[230px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_18px_34px_rgba(37,99,235,0.16)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_58%)] opacity-60 transition group-hover:opacity-100" />
              <div className="flex items-center justify-center">
                <div className="relative h-40 w-40">
                  <Image
                    src={house.logo}
                    alt={`${house.name} logo`}
                    fill
                    sizes="10rem"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="relative text-2xl font-semibold uppercase tracking-[0.12em] text-slate-800">
                {house.name}
              </p>
            </Link>
          ))}
        </div>
      </SelectionBoardFrame>
    </div>
  );
};

export default HouseSelectionBoard;
