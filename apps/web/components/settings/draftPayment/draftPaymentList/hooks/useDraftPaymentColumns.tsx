import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { TempPaymentDetails } from "@web/components/settings/draftPayment/draftPaymentList/hooks/useGetDraftPayment";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

export const useDraftPaymentColumns = () => {
  const column: AgColumnsWithActions<TempPaymentDetails> = [
    {
      field: "branch_name",
      headerName: t("branch.name.label"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: t("date.label"),
    },
    {
      field: "event_name",
      headerName: t("common.event.label"),
    },
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "total_amount",
      headerName: t("amount.label"),
    },
  ];

  return { column };
};
