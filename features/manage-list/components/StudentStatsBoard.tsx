"use client";

import { useMemo } from "react";
import StudentStatCard from "@/features/manage-list/components/StudentStatCard";
import { STUDENT_STATS } from "@/features/manage-list/constants/stats";
import { useStudentsStats } from "@/globals/hooks/useStudents";

const StudentStatsBoard = () => {
  const { data: studentStats } = useStudentsStats();

  const countsByCategory = useMemo(() => {
    if (!studentStats) return null;

    return {
      ALL: studentStats.ALL,
      COLLEGE: studentStats.COLLEGE,
      SHS: studentStats.SHS,
      HOUSE: studentStats.HOUSE,
    };
  }, [studentStats]);

  const stats = useMemo(
    () =>
      STUDENT_STATS.map((stat) => ({
        ...stat,
        value: countsByCategory?.[stat.category] ?? null,
      })),
    [countsByCategory],
  );

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {stats.map((stat) => (
          <StudentStatCard key={stat.title} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default StudentStatsBoard;
