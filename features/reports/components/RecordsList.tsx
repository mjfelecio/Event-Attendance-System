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
  const { data, isLoading } = useAllRecordsFromEvent(selectedEvent?.id);
  const records = useMemo(() => data ?? [], [data]);

  if (!selectedEvent) return null;

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
