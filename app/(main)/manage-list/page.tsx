"use client";

import StudentStatsBoard from "@/features/manage-list/components/StudentStatsBoard";

const ManageList = () => {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-1 justify-center bg-neutral-100 px-6 py-12 text-neutral-900 md:px-10">
      <div className="flex w-full max-w-6xl flex-col items-center gap-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-[0.35em] text-neutral-800 md:text-3xl">
            STUDENT'S LIST
          </h1>
          <p className="mt-3 max-w-xl text-sm text-neutral-500">
            Choose a student category below to manage its roster and related attendance information.
          </p>
        </div>

        <StudentStatsBoard />
      </div>
    </section>
  );
};

export default ManageList;