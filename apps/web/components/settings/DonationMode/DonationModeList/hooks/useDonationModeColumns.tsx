import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { DonationMode } from "@web/components/settings/DonationMode/DonationModeList/hooks/useGetDonationMode";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useDonationModeColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

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
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
      maxWidth: 180,
    },
    {
      field: "is_bank",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isBank.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
