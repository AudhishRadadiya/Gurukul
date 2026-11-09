import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { SuvicharDetails } from "@web/components/settings/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useSuvicharMasterColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<SuvicharDetails> = [
    {
      field: "suvichar",
      headerName: t("suvichar.menu.label"),
    },
    {
      field: "is_sms",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("sms.label"),
    },
    {
      field: "is_whatsapp",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("common.whatsApp.label"),
    },
  ];

  return { column };
};
