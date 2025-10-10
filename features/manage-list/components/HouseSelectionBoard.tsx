import Image from "next/image";
import SelectionBoardFrame from "@/features/manage-list/components/SelectionBoardFrame";
import Link from "next/link";
import { HOUSES } from "@/features/manage-list/constants/categories";

const HouseSelectionBoard = () => {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
        WHICH HOUSE?
      </h1>

      <SelectionBoardFrame>
        <div className="flex w-full flex-wrap justify-center gap-4 md:flex-nowrap">
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
              className="group flex h-[260px] w-[220px] flex-shrink-0 flex-col items-center justify-center gap-6 rounded-[2.25rem] border border-neutral-300 bg-white px-8 py-6 text-center shadow-sm transition-all hover:-translate-y-3 hover:border-neutral-400 hover:shadow-md md:w-[240px]"
            >
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <Image
                    src={house.logo}
                    alt={`${house.name} logo`}
                    fill
                    sizes="14rem"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="text-lg font-semibold uppercase tracking-wider text-neutral-700">
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
