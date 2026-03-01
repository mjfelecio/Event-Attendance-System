"use client";

import StudentStatsBoard from "@/features/manage-list/components/StudentStatsBoard";

const ManageList = () => {
  return (
    <section className="flex flex-1 justify-center overflow-y-auto bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#ffffff_100%)] p-6 text-slate-900 md:p-8">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <header className="overflow-hidden rounded-3xl border border-indigo-200/60 bg-[linear-gradient(130deg,#1e1b4b_0%,#1d4ed8_52%,#4f46e5_100%)] px-6 py-7 text-white shadow-[0_24px_50px_rgba(30,64,175,0.25)] md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Student Directory
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Student&apos;s List
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-blue-100/90">
            Choose a student category below to manage its roster and related
            attendance information.
          </p>
        </header>
        <StudentStatsBoard />
      </div>
    </section>
  );
};

export default ManageList;
