"use client";

import EventsList from "@/features/reports/components/EventsList";
import RecordsList from "@/features/reports/components/RecordsList";
import React from "react";

const ReportsPage = () => {
  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-3xl font-medium mb-4">Reports Page</h1>
      <div className="flex flex-1 gap-4">
        <EventsList />
        <RecordsList />
      </div>
    </div>
  );
};

export default ReportsPage;
