import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { ReceiptEntryDonationDetail } from "@web/components/Event/eventDonationEntry/dialogs/receiptEntryDetailDialog/hooks/useGetReceiptEntryDetail";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";
import { formatToIndianNumber } from "@web/utils/helper";

export const useReceiptEntryDetailListColumns = () => {
  const column: AgColumnsWithActions<ReceiptEntryDonationDetail> = [
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "donation_date",
      headerName: t("common.donation.date"),
    },
    {
      field: "trust_name",
      headerName: t("trust.label"),
    },
    {
      field: "donation_mode",
      headerName: t("donationMode.label"),
    },
    {
      field: "trust_receipt_no",
      headerName: t("common.trust.receipt.no"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      filter: "agNumberColumnFilter",
      headerName: t("amount.label"),
    },
  ];

  return { column };
};
