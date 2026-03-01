import Image from "next/image";
import Link from "next/link";
import { StudentStat } from "@/features/manage-list/types";

interface StudentStatCardProps {
  stat: StudentStat;
  isLoading?: boolean;
}

const StudentStatCard = ({ stat, isLoading = false }: StudentStatCardProps) => {
  const { icon: Icon, logo, title, align, category, value } = stat;
  const formattedValue = isLoading
    ? "..."
    : typeof value === "number" && value > 0
    ? new Intl.NumberFormat().format(value)
    : "N/A";
  const href =
    category === "all"
      ? `/manage-list/manage-student?category=all&label=All%20Students`
      : `/manage-list/manage-which?type=${category}`;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[200px] items-center overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_18px_34px_rgba(37,99,235,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_58%)] opacity-70 transition group-hover:opacity-100" />
      {align === "left" ? (
        <div className="relative flex w-full items-center justify-between gap-6">
          <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-2xl border border-slate-100 bg-white/70 p-2">
            {logo ? (
              <Image
                src={logo}
                alt={`${title} logo`}
                width={112}
                height={112}
                className="max-h-28 max-w-28 object-contain"
              />
            ) : (
              Icon ? <Icon className="size-16 text-slate-700" strokeWidth={1.3} /> : null
            )}
          </div>
          <p className="flex-1 text-center text-lg font-semibold text-slate-800 transition group-hover:text-slate-900 md:text-xl">
            {title}
          </p>
          <span className="min-w-[72px] text-right text-3xl font-bold text-indigo-700 transition group-hover:text-indigo-600">
            {formattedValue}
          </span>
        </div>
      ) : (
        <div className="relative flex w-full items-center justify-between gap-6">
          <span className="min-w-[72px] text-3xl font-bold text-indigo-700 transition group-hover:text-indigo-600">
            {formattedValue}
          </span>
          <p className="flex-1 text-center text-lg font-semibold text-slate-800 transition group-hover:text-slate-900 md:text-xl">
            {title}
          </p>
          <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-2xl border border-slate-100 bg-white/70 p-2">
            {logo ? (
              <Image
                src={logo}
                alt={`${title} logo`}
                width={112}
                height={112}
                className="max-h-28 max-w-28 object-contain"
              />
            ) : (
              Icon ? <Icon className="size-16 text-slate-700" strokeWidth={1.3} /> : null
            )}
          </div>
        </div>
      )}
    </Link>
  );
};

export default StudentStatCard;
