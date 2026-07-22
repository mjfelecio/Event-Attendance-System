"use client";

import { Event } from "@/globals/types/events";
import React, { useMemo } from "react";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import { reportColumns } from "../constants/eventRecordsTable";
import DataTable from "@/globals/components/shared/dataTable/DataTable";
import { DataTableErrorState } from "@/globals/components/shared/dataTable/DataTableStates";

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

  // Error presentation goes through the shared card (via isError/errorState)
  // rather than a separate red box, so loading/error/empty stay consistent.
  return (
    <DataTable
      columns={reportColumns}
      data={records}
      isLoading={isLoading}
      isError={isError}
      errorState={
        <DataTableErrorState
          title="Couldn't load attendance records"
          description="Please retry."
        />
      }
      // No `title` here: the page renders the single "Attendance Records"
      // heading above this table, so passing a title would duplicate it. The
      // toolbar still renders its search box.
      // The reports event can change without unmounting this table; restart at
      // page 1 for the newly selected event.
      resetKey={selectedEvent.id}
    />
  );
};

export default RecordsList;
