import { LoadingCell } from "@codezee/sixtify-brahma";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import type { EventSummary } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummary";
import type { AgColumnsArgs, AgColumnsWithActions } from "@web/types/agGrid";

type UseEventSummaryColumns = {
  loading: boolean;
};

export const useEventSummaryColumns = ({
  loading = false,
}: AgColumnsArgs<UseEventSummaryColumns>) => {
  const column: AgColumnsWithActions<EventSummary> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      field: "event_type",
      filter: "agTextColumnFilter",
      headerName: t("common.event.label"),
      sortable: true,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      field: "total_receipt",
      filter: "agTextColumnFilter",
      headerName: t("receipts.label"),
      sortable: true,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      field: "total_amount",
      filter: "agTextColumnFilter",
      headerName: t("amount.label"),
      sortable: true,
    },
  ];

  return { column };
};
