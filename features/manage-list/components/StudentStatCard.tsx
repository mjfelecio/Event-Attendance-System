import Link from "next/link";
import { StudentStat } from "@/features/manage-list/types";
interface StudentStatCardProps {
  stat: StudentStat;
}

const StudentStatCard = ({ stat }: StudentStatCardProps) => {
  const { icon: Icon, title, align, category, value } = stat;
  const formattedValue = new Intl.NumberFormat().format(value ?? 0);
  const href = `/manage-list/manage-which?type=${category}`;

  return (
    <Link
      href={href}
      className="group flex min-h-[136px] items-center rounded-[1.5rem] border border-neutral-300 bg-white px-6 py-5 shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 hover:-translate-y-1 hover:border-neutral-400 hover:shadow-md"
    >
      {align === "left" ? (
        <div className="flex w-full items-center justify-between gap-6">
          <span className="flex size-16 items-center justify-center rounded-2xl border border-neutral-300 bg-white transition group-hover:border-neutral-400">
            <Icon className="size-9" strokeWidth={1.3} />
          </span>
          <p className="flex-1 text-center text-lg font-medium text-neutral-800 transition group-hover:text-neutral-600 md:text-xl">
            {title}
          </p>
          <span className="text-2xl font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {formattedValue}
          </span>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-6">
          <span className="text-2xl font-semibold text-neutral-900 transition group-hover:text-neutral-600">
            {formattedValue}
          </span>
          <p className="flex-1 text-center text-lg font-medium text-neutral-800 transition group-hover:text-neutral-600 md:text-xl">
            {title}
          </p>
          <span className="flex size-16 items-center justify-center rounded-2xl border border-neutral-300 bg-white transition group-hover:border-neutral-400">
            <Icon className="size-9" strokeWidth={1.3} />
          </span>
        </div>
      )}
    </Link>
  );
};

export default StudentStatCard;
