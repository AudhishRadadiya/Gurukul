import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import _flatMap from "lodash/flatMap";
import _isEmpty from "lodash/isEmpty";
import _mapValues from "lodash/mapValues";
import _pickBy from "lodash/pickBy";
import _uniq from "lodash/uniq";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { useEventItemSummaryColumns } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useEventItemSummaryColumns";
import type { EventItemSummary } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummary";
import { useGetEventItemSummary } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummary";
import { useBranch } from "@web/context/BranchContext";
import { filterSearchParams } from "@web/utils/helper";

export type EventSummaryListProps = {
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

export const buildQuery = (filters: Record<string, string>) =>
  _mapValues(
    _pickBy(filters, (v) => !_isEmpty(v)),
    (v) => (Array.isArray(v) ? v.join(",") : String(v))
  );

export const EventItemSummaryList = ({
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
}: EventSummaryListProps) => {
  const { branchIds } = useBranch();

  const { isMobile } = useGetDeviceType();

  const { data, isFetching, isLoading } = useGetEventItemSummary({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { eventItemSummary, totalCount = 0 } = data ?? {};

  const dynamicVariantTypes = useMemo<string[]>(
    () =>
      _uniq(
        _flatMap(
          eventItemSummary || [],
          ({ event_items }) => event_items?.map((v) => v.title) || []
        )
      ),
    [eventItemSummary]
  );

  const { column } = useEventItemSummaryColumns({
    dynamicVariantTypes,
    loading: isLoading,
  });

  return (
    <AgGridV2<EventItemSummary>
      isLoading={isFetching}
      page={page}
      columnDefs={column}
      rowsPerPage={rowsPerPage}
      rowData={eventItemSummary}
      onPageChange={onPageChange}
      count={totalCount}
      onGridStateChange={setAgGridState}
      onRowsPerPageChange={onRowsPerPageChange}
      height={isMobile ? 200 : 230}
    />
  );
};
