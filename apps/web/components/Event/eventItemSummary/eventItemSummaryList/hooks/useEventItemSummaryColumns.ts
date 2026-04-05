import type { ColDef } from "ag-grid-community";
import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventItemSummary } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummary";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
  AgDataWithActions,
} from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

type EventItemSummaryColumns = {
  dynamicVariantTypes: string[];
  loading: boolean;
};

export const useEventItemSummaryColumns = ({
  dynamicVariantTypes,
}: AgColumnsArgs<EventItemSummaryColumns>) => {
  const variantColumns: ColDef<AgDataWithActions<EventItemSummary>>[] =
    dynamicVariantTypes.map((variantType) => {
      const fieldName = "event_items" as const;

      return {
        cellRenderer: ({ data }: CustomCellRendererProps<EventItemSummary>) => {
          const { event_items } = data ?? {};

          if (!event_items) {
            return "-";
          }

          const eventItem = event_items.find(
            ({ title }) => title === variantType
          );

          const { title, total_amount, value } = eventItem || {};

          return total_amount ?? value ?? title ?? "-";
        },
        field: fieldName,
        filter: false,
        headerName: variantType,
        minWidth: 150,
        sortable: false,
      };
    });

  const column: AgColumnsWithActions<EventItemSummary> = [
    {
      field: "event_name",
      headerName: t("common.event.label"),
      minWidth: 150,
      sortable: false,
    },
    ...variantColumns,
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "total",
      headerName: t("amount.label"),
      minWidth: 150,
      sortable: false,
    },
  ];

  return { column };
};
