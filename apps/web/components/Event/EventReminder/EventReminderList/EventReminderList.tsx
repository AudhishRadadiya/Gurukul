import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { useEventReminderColumns } from "@web/components/Event/EventReminder/EventReminderList/hooks/useEventReminderColumns";
import type { EventReminder } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import { useGetEventReminder } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminder";
import { useBranch } from "@web/context/BranchContext";
import { filterSearchParams } from "@web/utils/helper";

export type EventReminderListProps = {
  agGridState: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  };
  endRow: number;
  externalFilter: FieldValues;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  page: number;
  rowsPerPage: number;
  search: string;
  setAgGridState: (data: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }) => void;
  startRow: number;
};

export const EventReminderList = ({
  agGridState,
  endRow,
  externalFilter,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  search,
  setAgGridState,
  startRow,
}: EventReminderListProps) => {
  const { branchIds } = useBranch();

  const { isMobile } = useGetDeviceType();

  const { data, isFetching } = useGetEventReminder({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
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
      onGridStateChange={setAgGridState}
      height={isMobile ? 220 : 230}
    />
  );
};

EventReminderList.displayName = "EventReminderList";
