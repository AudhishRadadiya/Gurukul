import { t } from "i18next";

import type { SuvicharDetails } from "@web/components/settings/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useSuvicharMasterColumns = () => {
  const column: AgColumnsWithActions<SuvicharDetails> = [
    {
      field: "suvichar",
      headerName: t("suvichar.menu.label"),
    },
    {
      field: "is_sms",
      headerName: t("sms.label"),
    },
    {
      field: "is_whatsapp",
      headerName: t("common.whatsApp.label"),
    },
  ];

  return { column };
};
