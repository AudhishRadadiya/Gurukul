import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import _mapValues from "lodash/mapValues";
import _pickBy from "lodash/pickBy";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useEventSummaryColumns } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useEventSummaryColumns";
import type { EventSummary } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummary";
import { useGetEventSummary } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummary";
import { useBranch } from "@web/context/BranchContext";
import { filterSearchParams } from "@web/utils/helper";

export type EventSummaryListProps = {
  agGridState: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  };
  externalFilter: FieldValues;
  search: string;
  setAgGridState: (data: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }) => void;
};

export const buildQuery = (filters: Record<string, string>) =>
  _mapValues(
    _pickBy(filters, (v) => !_isEmpty(v)),
    (v) => (Array.isArray(v) ? v.join(",") : String(v))
  );

export const EventSummaryList = forwardRef(
  ({
    agGridState,
    externalFilter,
    search,
    setAgGridState,
  }: EventSummaryListProps) => {
    const router = useRouter();

    const { isMobile } = useGetDeviceType();

    const { branchIds } = useBranch();

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching, isLoading } = useGetEventSummary({
      endRow,
      externalFilter: { ...externalFilter, branch_id: [branchIds] },
      filterModel: agGridState.filterModel,
      quickFilter: filterSearchParams(search),
      sortModel: agGridState.sortModel,
      startRow,
    });

    const { eventSummaryData: rowData, totalCount = 0 } = data ?? {};

    const { column } = useEventSummaryColumns({
      loading: isLoading,
    });

    return (
      <AgGridV2<EventSummary>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        height={isMobile ? 220 : 240}
        actions={[
          {
            onClick: (data) => {
              const query: FieldValues = buildQuery({
                ...externalFilter,
                event_id: data.event_type_id,
              });

              const params = new URLSearchParams(query).toString();

              router.push(`/event/donation?page=event-summary&${params}`);
            },
            title: t("common.details.label"),
          },
        ]}
      />
    );
  }
);

EventSummaryList.displayName = "EventSummaryList";
