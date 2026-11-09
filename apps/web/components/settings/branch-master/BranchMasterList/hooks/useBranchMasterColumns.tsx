import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useBranchMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<Branch> = [
    {
      field: "branch_name",
      headerName: t("branch.name.label"),
    },
    {
      field: "branch_code",
      headerName: t("branch.code.label"),
    },
    {
      field: "address",
      headerName: t("common.address"),
    },
    {
      field: "city",
      headerName: t("common.city"),
    },
    {
      field: "gst_no",
      headerName: t("gst.no.label"),
    },
    {
      field: "contact_person_name",
      headerName: t("contact.person.label"),
    },
    {
      field: "contact_no",
      headerName: t("common.contact.label"),
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
    },
    {
      field: "is_online",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isOnline.label"),
    },
  ];

  return { column };
};
