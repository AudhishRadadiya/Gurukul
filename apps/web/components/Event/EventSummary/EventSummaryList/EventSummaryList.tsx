import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import _mapValues from "lodash/mapValues";
import _pickBy from "lodash/pickBy";
import { useRouter } from "next/navigation";
import { forwardRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useEventSummaryColumns } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useEventSummaryColumns";
import type { EventSummary } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummary";
import { useGetEventSummary } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummary";

export type EventSummaryListProps = {
  externalFilter: FieldValues;
};

export const buildQuery = (filters: Record<string, string>) =>
  _mapValues(
    _pickBy(filters, (v) => !_isEmpty(v)),
    (v) => (Array.isArray(v) ? v.join(",") : String(v))
  );

export const EventSummaryList = forwardRef(
  ({ externalFilter }: EventSummaryListProps) => {
    const router = useRouter();

    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching, isLoading } = useGetEventSummary({
      endRow,
      externalFilter,
      filterModel: agGridFilterModel,
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
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={260}
        actions={[
          {
            onClick: () => {
              const { event_type, ...restFilters } = externalFilter;

              const query: FieldValues = buildQuery({
                ...restFilters,
                event_type_id: event_type,
              });

              const params = new URLSearchParams(query).toString();

              router.push(
                `/donation/donation-entry?page=event-summary&${params}`
              );
            },
            title: t("common.details.label"),
          },
        ]}
      />
    );
  }
);

EventSummaryList.displayName = "EventSummaryList";
