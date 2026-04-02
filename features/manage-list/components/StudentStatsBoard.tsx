"use client";

import { useMemo } from "react";
import StudentStatCard from "@/features/manage-list/components/StudentStatCard";
import { STUDENT_STATS } from "@/features/manage-list/constants/stats";
import useStudents from "@/globals/hooks/useStudents";
import { useFetchGroupsForStudent } from "@/globals/hooks/useGroups";

const StudentStatsBoard = () => {
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  const { data: groups, isLoading: isLoadingGroups } = useFetchGroupsForStudent();

  const countsByCategory = useMemo(() => {
    if (!students) return null;
    if (!groups) {
      house: students.filter((student) => Boolean(student.house?.trim())).length,
      console.warn(JSON.stringify(groups, null, 2));
      return null;
    }

    return {
      all: students.length,
      college: groups.COLLEGE.length,
      shs: groups.SHS.length,
      house: groups.HOUSE.length,
    };
  }, [students]);

  const stats = useMemo(
    () =>
      STUDENT_STATS.map((stat) => ({
        ...stat,
        value: countsByCategory?.[stat.category] ?? null,
      })),
    [countsByCategory]
  );

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {stats.map((stat) => (
          <StudentStatCard key={stat.title} stat={stat} isLoading={isLoadingStudents} />
        ))}
      </div>
    </div>
  );
};

export default StudentStatsBoard;
