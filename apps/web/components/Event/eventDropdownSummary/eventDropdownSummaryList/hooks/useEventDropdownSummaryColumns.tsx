import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { EventDropdownReport } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useGetEventDropdownSummary";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

export const useEventDropdownSummaryColumns = () => {
  const column: AgColumnsWithActions<EventDropdownReport> = [
    {
      field: "dropdown_name",
      headerName: t("common.event.dropdown"),
      minWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "total_amount",
      headerName: t("amount.label"),
      minWidth: 170,
    },
    {
      field: "total_receipt",
      headerName: t("common.receipt.label", {
        label: t("common.number.label"),
      }),
      minWidth: 170,
    },
  ];

  return { column };
};
