import { t } from "i18next";

import type { DonationMaster } from "@web/components/settings/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useDonationMasterColumns = () => {
  const column: AgColumnsWithActions<DonationMaster> = [
    {
      field: "donation_master_name",

      headerName: t("common.name.label", {
        label: t("donation.menu.label"),
      }),
      sortable: true,
    },
    {
      field: "is_active",

      headerName: t("isActive.label"),
      maxWidth: 180,
    },
    {
      field: "remark",
      headerName: t("remark.label"),
    },
    {
      field: "branch_name",

      headerName: t("common.name.label", {
        label: t("branch.label"),
      }),
    },
  ];

  return { column };
};
