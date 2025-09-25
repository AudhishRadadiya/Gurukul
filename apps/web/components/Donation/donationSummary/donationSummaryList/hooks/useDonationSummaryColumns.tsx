import { t } from "i18next";

import type { DonationSummary } from "@web/components/Donation/donationSummary/donationSummaryList/hooks/useGetDonationSummary";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useDonationSummaryColumns = () => {
  const column: AgColumnsWithActions<DonationSummary> = [
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
    },
    {
      field: "first_name",
      headerName: t("common.first.name"),
    },
    {
      field: "middle_name",
      headerName: t("common.middle.name"),
    },
    {
      field: "last_name",
      headerName: t("common.last.name"),
    },
    {
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
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
    {
      field: "pan_no",
      headerName: t("common.pan.no"),
    },
    {
      field: "email_id",
      headerName: t("email.label"),
    },
  ];

  return { column };
};
