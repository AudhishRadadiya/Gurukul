import { t } from "i18next";

import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useSMSMasterColumns = () => {
  const column: AgColumnsWithActions<SMSMaster> = [
    {
      field: "sms_name",
      headerName: t("common.name.label", {
        label: t("sms.label"),
      }),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
  ];

  return { column };
};
