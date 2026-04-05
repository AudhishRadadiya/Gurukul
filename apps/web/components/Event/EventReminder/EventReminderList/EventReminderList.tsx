import type { FilterModel } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { useEventReminderColumns } from "@web/components/Event/EventReminder/EventReminderList/hooks/useEventReminderColumns";
import type { EventReminder } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import { useGetEventReminder } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import { useBranch } from "@web/context/BranchContext";

export type EventReminderListProps = {
  agGridFilterModel: FilterModel;
  endRow: number;
  externalFilter: FieldValues;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  page: number;
  rowsPerPage: number;
  setAgGridFilterModel: (data: FilterModel) => void;
  startRow: number;
};

export const EventReminderList = ({
  agGridFilterModel,
  endRow,
  externalFilter,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  setAgGridFilterModel,
  startRow,
}: EventReminderListProps) => {
  const { branchIds } = useBranch();

  const { data, isFetching } = useGetEventReminder({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridFilterModel,
    startRow,
  });

  const { eventReminderData, totalCount } = data || {};

  const { column } = useEventReminderColumns();

  return (
    <AgGridV2<EventReminder>
      isLoading={isFetching}
      page={page}
      columnDefs={column}
      rowsPerPage={rowsPerPage}
      rowData={eventReminderData}
      onPageChange={onPageChange}
      count={totalCount}
      onRowsPerPageChange={onRowsPerPageChange}
      onFilterChange={setAgGridFilterModel}
      height={260}
    />
  );
};

EventReminderList.displayName = "EventReminderList";
