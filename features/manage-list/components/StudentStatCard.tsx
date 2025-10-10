import Image from "next/image";
import Link from "next/link";
import { StudentStat } from "@/features/manage-list/types";
interface StudentStatCardProps {
  stat: StudentStat;
}

const StudentStatCard = ({ stat }: StudentStatCardProps) => {
  const { icon: Icon, logo, title, align, category, value } = stat;
  const formattedValue = new Intl.NumberFormat().format(value ?? 0);
  const href =
    category === "all"
      ? `/manage-list/manage-student?category=all&label=All%20Students`
      : `/manage-list/manage-which?type=${category}`;

  return (
    <Link
      href={href}
      className="group flex min-h-[200px] items-center rounded-[1.5rem] border border-neutral-300 bg-white px-8 py-7 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-md"
    >
      {align === "left" ? (
        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex min-h-[128px] min-w-[128px] items-center justify-center">
            {logo ? (
              <Image src={logo} alt={`${title} logo`} width={128} height={128} className="max-h-32 max-w-32 object-contain" />
            ) : (
              Icon ? <Icon className="size-20" strokeWidth={1.3} /> : null
            )}
          </div>
          <p className="flex-1 text-center text-lg font-medium text-neutral-800 transition group-hover:text-neutral-600 md:text-xl">
            {title}
          </p>
          <span className="text-2xl font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {formattedValue}
          </span>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-8">
          <span className="text-2xl font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {formattedValue}
          </span>
          <p className="flex-1 text-center text-lg font-medium text-neutral-800 transition group-hover:text-neutral-600 md:text-xl">
            {title}
          </p>
          <div className="flex min-h-[128px] min-w-[128px] items-center justify-center">
            {logo ? (
              <Image src={logo} alt={`${title} logo`} width={128} height={128} className="max-h-32 max-w-32 object-contain" />
            ) : (
              Icon ? <Icon className="size-20" strokeWidth={1.3} /> : null
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default StudentStatCard;
