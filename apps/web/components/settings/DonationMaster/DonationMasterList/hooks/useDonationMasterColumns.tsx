import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { DonationMaster } from "@web/components/settings/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useDonationMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<DonationMaster> = [
    {
      field: "donation_master_name",

      headerName: t("common.name.label", {
        label: t("donation.master.label"),
      }),
      sortable: true,
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
      field: "is_csr",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
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
