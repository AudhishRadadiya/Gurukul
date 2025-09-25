import { t } from "i18next";

import type { DonationReceiptEntryDetail } from "@web/components/Donation/donationEntry/dialogs/hooks/useGetDonationReceiptEntryDetail";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useDonationReceiptEntryListColumns = () => {
  const column: AgColumnsWithActions<DonationReceiptEntryDetail> = [
    {
      field: "event_master_name",
      headerName: t("common.event.label"),
    },
    {
      field: "date",
      headerName: t("common.book", {
        label: t("date.label"),
      }),
    },
    {
      field: "amount",
      headerName: t("common.book", {
        label: t("amount.label"),
      }),
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
