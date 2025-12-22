"use client";

import { Event } from "@/globals/types/events";
import React, { useMemo } from "react";
import Toolbar from "./Toolbar";
import { useAllRecordsFromEvent } from "@/globals/hooks/useRecords";
import DataTable from "@/globals/components/shared/DataTable";
import { useDataTable } from "@/globals/hooks/useDataTable";
import { reportColumns } from "../constants/eventRecordsTable";

type Props = {
  selectedEvent: Event | null;
};

const RecordsList = ({ selectedEvent }: Props) => {
  const { data, isLoading, error } = useAllRecordsFromEvent(selectedEvent?.id);

  const records = useMemo(() => data ?? [], [data]);

  const table = useDataTable(records, reportColumns);

  return (
    <div className="border-2 border-gray-300 rounded-md flex-2 h-full overflow-hidden">
      <Toolbar />

      {/* Attendance Records List */}
      <div className="flex flex-1 items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 border-2 border-gray-300 w-full rounded-md p-6">
            <h3 className="text-3xl">Loading...</h3>
          </div>
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};

export default RecordsList;
