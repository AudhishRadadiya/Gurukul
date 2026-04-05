import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { DonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

type UseDonationSummaryColumnsProps = {
  onlyContactNo: boolean;
};

export const useDonationSummaryColumns = ({
  onlyContactNo,
}: UseDonationSummaryColumnsProps) => {
  const column: AgColumnsWithActions<DonationSummary> = [
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
    },
    {
      field: "receipt_name",
      headerName: t("common.receipt.name"),
      hide: onlyContactNo,
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "amount",
      headerName: t("amount.label"),
    },
    {
      field: "receipts_count",
      headerName: t("receipt.label"),
    },
    {
      field: "address",
      headerName: t("address.menu.label"),
      hide: onlyContactNo,
    },
    {
      field: "city",
      headerName: t("common.city"),
      hide: onlyContactNo,
    },
    {
      field: "pan_no",
      headerName: t("common.pan.no"),
      hide: onlyContactNo,
    },
    {
      field: "email_id",
      headerName: t("email.label"),
      hide: onlyContactNo,
    },
  ];

  return { column };
};
