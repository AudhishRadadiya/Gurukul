import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { dateFormat } from "@web/utils/date";

type UseDonationReceiptEntryListColumnsProps = {
  onAmountEdit?: (data: DonationReceiptEntryDetail, newAmount: number) => void;
};

export const useDonationReceiptEntryListColumns = ({
  onAmountEdit,
}: UseDonationReceiptEntryListColumnsProps = {}) => {
  const column: AgColumnsWithActions<DonationReceiptEntryDetail> = [
    {
      field: "event_master_name",
      headerName: t("common.event.label"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value ? AG_GRID_CELL_DEFAULT_VALUE : dateFormat(value, true);
      },
      field: "date",
      headerName: t("common.book", {
        label: t("date.label"),
      }),
    },
    {
      editable: true,
      field: "new_amount",
      headerName:
        t("common.book", {
          label: t("amount.label"),
        }) + ` - (${t("common.click.to.edit") + " ✏️"})`,
      headerTooltip: t("common.this.field.is.editable"),
      onCellValueChanged: (params) => {
        if (onAmountEdit) {
          onAmountEdit(params.data, params.newValue);
        }
      },
      valueParser: (params) => {
        const newValue = Number(params.newValue);

        return isNaN(newValue) ? params.oldValue : newValue;
      },
    },
    {
      field: "received_amount",
      headerName: t("common.received.amount"),
    },
    {
      field: "pending_amount",
      headerName: t("common.pending.amount"),
    },
    {
      field: "remark",
      headerName: t("remark.label"),
    },
  ];

  return { column };
};
