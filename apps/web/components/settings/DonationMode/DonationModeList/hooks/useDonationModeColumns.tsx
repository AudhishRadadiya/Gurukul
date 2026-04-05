import { t } from "i18next";

import type { DonationMode } from "@web/components/settings/DonationMode/DonationModeList/hooks/useGetDonationMode";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useDonationModeColumns = () => {
  const column: AgColumnsWithActions<DonationMode> = [
    {
      field: "donation_mode_name",
      headerName: t("common.name.label", {
        label: t("common.mode.label", {
          label: t("donation.menu.label"),
        }),
      }),
    },
    {
      field: "donation_mode_code",
      headerName: t("common.donation.mode.code"),
    },
    {
      field: "donation_mode_receipt",
      headerName: t("common.name.label", {
        label: t("donationReceipt.label"),
      }),
    },
    {
      field: "branch_name",
      headerName: t("branchNames.label"),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
      maxWidth: 180,
    },
    {
      field: "is_bank",
      headerName: t("isBank.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
