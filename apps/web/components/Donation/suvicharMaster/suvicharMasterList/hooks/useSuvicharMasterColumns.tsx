import { t } from "i18next";

import type { SuvicharDetails } from "@web/components/Donation/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useSuvicharMasterColumns = () => {
  const column: AgColumnsWithActions<SuvicharDetails> = [
    {
      field: "suvichar",
      headerName: t("suvichar.menu.label"),
    },
  ];

  return { column };
};
