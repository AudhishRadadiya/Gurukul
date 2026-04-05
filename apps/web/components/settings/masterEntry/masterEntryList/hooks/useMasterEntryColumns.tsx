import { t } from "i18next";

import type { MasterParameterDetails } from "@web/components/settings/masterEntry/masterEntryList/hooks/useGetMasterEntry";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useMasterEntryColumns = () => {
  const column: AgColumnsWithActions<MasterParameterDetails> = [
    {
      field: "name",
      headerName: t("common.name"),
    },
    {
      field: "master_type",
      headerName: t("master.type.menu.label"),
    },
  ];

  return { column };
};
