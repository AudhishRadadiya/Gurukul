import { t } from "i18next";

import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useBranchMasterColumns = () => {
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
  ];

  return { column };
};
