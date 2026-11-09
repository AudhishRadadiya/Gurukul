import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { MasterType } from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useMasterTypeColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<MasterType> = [
    {
      field: "master_type",
      headerName: t("master.type.menu.label"),
    },
    {
      field: "is_hastak",
      filter: CustomEnumFilter,
      filterParams: { filterOptions: trueFalseOptions, source: "server" },
      headerName: t("isActive.label"),
      minWidth: 100,
    },
  ];

  return { column };
};
