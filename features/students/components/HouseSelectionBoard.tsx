"use client";

import Link from "next/link";
import SelectionBoardFrame from "@/features/students/components/SelectionBoardFrame";
import GroupTileArt from "@/features/students/components/GroupTileArt";
import { useFetchGroupsByCategory } from "@/globals/hooks/useGroups";
import { Skeleton } from "@/globals/components/shad-cn/skeleton";

const HouseSelectionBoard = () => {
  const { data: houses, isLoading, isError } = useFetchGroupsByCategory("HOUSE");

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
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="min-h-[250px] w-full max-w-[230px] rounded-2xl"
                />
              ))
            : houses?.map((house) => (
                <Link
                  key={house.slug}
                  href={{
                    pathname: "/students/student-list",
                    query: {
                      category: "HOUSE",
                      house: house.slug,
                    },
                  }}
                  className="group relative flex min-h-[250px] w-full max-w-[230px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_18px_34px_rgba(37,99,235,0.16)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_58%)] opacity-60 transition group-hover:opacity-100" />
                  <div className="flex items-center justify-center">
                    <GroupTileArt slug={house.slug} name={house.name} />
                  </div>
                  <p className="relative text-2xl font-semibold uppercase tracking-[0.12em] text-slate-800">
                    {house.name}
                  </p>
                </Link>
              ))}
        </div>

        {isError ? (
          <p className="mt-4 text-sm text-rose-600">
            Couldn&apos;t load houses. Please retry.
          </p>
        ) : null}

        {!isLoading && !isError && houses?.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No houses yet. Add one in Settings.
          </p>
        ) : null}
      </SelectionBoardFrame>
    </div>
  );
};

export default HouseSelectionBoard;
