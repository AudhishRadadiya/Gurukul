import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { CancelReceipt } from "@web/components/Donation/cancelReceipt/cancelReceiptList/hooks/useGetCancelReceipt";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useCancelReceiptColumns = () => {
  const column: AgColumnsWithActions<CancelReceipt> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      filter: "agDateColumnFilter",
      headerName: t("date.label"),
      maxWidth: 150,
    },
    {
      field: "receipt_no",
      headerName: t("common.receipt.label", {
        label: t("common.no"),
      }),
    },
    {
      field: "trust_name",
      headerName: t("trust.label"),
    },
    {
      field: "amount",
      headerName: t("amount.label"),
      maxWidth: 200,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "cancel_date",
      filter: "agDateColumnFilter",
      headerName: t("cancelDate.label"),
      maxWidth: 150,
    },
    {
      field: "user",
      headerName: t("common.user.label"),
    },
  ];

  return { column };
};
