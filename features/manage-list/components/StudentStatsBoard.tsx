import StudentStatCard from "@/features/manage-list/components/StudentStatCard";
import { STUDENT_STATS } from "@/features/manage-list/constants/stats";

const StudentStatsBoard = () => {
  return (
    <div className="w-full rounded-[2.5rem] border border-neutral-300 bg-white px-6 py-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:px-14 md:py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {STUDENT_STATS.map((stat) => (
          <StudentStatCard key={stat.title} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default StudentStatsBoard;
