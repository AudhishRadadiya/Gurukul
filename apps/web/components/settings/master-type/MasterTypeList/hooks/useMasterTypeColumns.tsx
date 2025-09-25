import { t } from "i18next";

import type { MasterType } from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useMasterTypeColumns = () => {
  const column: AgColumnsWithActions<MasterType> = [
    {
      field: "master_type",
      headerName: t("master.type.menu.label"),
    },
  ];

  return { column };
};
