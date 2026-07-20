"use client";

import { Event } from "@/globals/types/events";
import React, { useMemo } from "react";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import { reportColumns } from "../constants/eventRecordsTable";
import DataTable from "@/globals/components/shared/dataTable/DataTable";

type Props = {
  selectedEvent: Event | null;
};

const RecordsList = ({ selectedEvent }: Props) => {
  // Report view: every currently-eligible student with present/absent status,
  // so the rows agree with the summary's present/absent counts.
  const { data, isLoading, isError } = useAllRecordsFromEvent(
    selectedEvent?.id,
    { includeAbsent: true }
  );
  const records = useMemo(() => data ?? [], [data]);

  if (!selectedEvent) return null;

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Couldn&apos;t load attendance records. Please retry.
      </div>
    );
  }

  return (
    <DataTable
      columns={reportColumns}
      data={records}
      isLoading={isLoading}
      title="Attendance Records"
    />
  );
};

export default RecordsList;
