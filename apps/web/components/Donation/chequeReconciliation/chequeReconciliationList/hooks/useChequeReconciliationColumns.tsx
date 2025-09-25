import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { chequeStatusTypes } from "@web/components/common/Autocomplete/hooks/useGetChequeStatusOptions";
import type { ChequeReconciliation } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliation";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

export const useChequeReconciliationColumns = () => {
  const column: AgColumnsWithActions<ChequeReconciliation> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      filter: "agDateColumnFilter",
      headerName: t("date.label"),
      minWidth: 130,
      sortable: true,
    },
    {
      field: "receipt_no",
      filter: "agTextColumnFilter",
      headerName: t("common.receipt.label", {
        label: t("common.no"),
      }),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "trust",
      filter: "agTextColumnFilter",
      headerName: t("trust.label"),
      minWidth: 130,
      sortable: true,
    },
    {
      field: "receipt_name",
      filter: "agTextColumnFilter",
      headerName: t("common.receipt.label", {
        label: t("name.label"),
      }),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "event",
      filter: "agNumberColumnFilter",
      headerName: t("common.event.label"),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "amount",
      filter: "agNumberColumnFilter",
      headerName: t("amount.label"),
      minWidth: 170,
      sortable: true,
    },
    {
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<ChequeReconciliation>) => {
        return !data
          ? AG_GRID_CELL_DEFAULT_VALUE
          : (chequeStatusTypes[data.cheque_status] ??
              AG_GRID_CELL_DEFAULT_VALUE);
      },
      field: "cheque_status",
      filter: "agNumberColumnFilter",
      headerName: t("cheque.label", {
        label: t("status.label"),
      }),
      minWidth: 170,
      sortable: true,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "pass_date",
      filter: "agDateColumnFilter",
      headerName: t("passDate.label"),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "cheque_no",
      filter: "agNumberColumnFilter",
      headerName: t("cheque.label", {
        label: t("common.no"),
      }),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "pass_bank",
      filter: "agTextColumnFilter",
      headerName: t("passBank.label"),
      minWidth: 170,
      sortable: true,
    },
    {
      field: "pass_by_user",
      filter: "agTextColumnFilter",
      headerName: t("passByUser.label"),
      minWidth: 200,
      sortable: true,
    },
  ];

  return { column };
};
