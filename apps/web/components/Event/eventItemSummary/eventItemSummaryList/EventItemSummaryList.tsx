import type { FilterModel } from "ag-grid-community";
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

export type EventSummaryListProps = {
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

export const buildQuery = (filters: Record<string, string>) =>
  _mapValues(
    _pickBy(filters, (v) => !_isEmpty(v)),
    (v) => (Array.isArray(v) ? v.join(",") : String(v))
  );

export const EventItemSummaryList = ({
  agGridFilterModel,
  endRow,
  externalFilter,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  setAgGridFilterModel,
  startRow,
}: EventSummaryListProps) => {
  const { branchIds } = useBranch();

  const { data, isFetching, isLoading } = useGetEventItemSummary({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridFilterModel,
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
      onFilterChange={setAgGridFilterModel}
      onRowsPerPageChange={onRowsPerPageChange}
      height={260}
    />
  );
};
