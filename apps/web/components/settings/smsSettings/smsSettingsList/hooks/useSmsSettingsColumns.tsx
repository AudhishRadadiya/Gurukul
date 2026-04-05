import { t } from "i18next";

import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useSmsSettingsColumns = () => {
  const column: AgColumnsWithActions<SmsSettingDetail> = [
    {
      field: "sms_username",
      headerName: t("common.sms.label", {
        label: t("common.username"),
      }),
      minWidth: 130,
    },
    {
      field: "sms_sender_id",
      headerName: t("common.sms.label", {
        label: t("common.sender"),
      }),
      minWidth: 160,
    },
    {
      field: "sms_url",
      headerName: t("common.sms.label", {
        label: t("common.url"),
      }),
      minWidth: 200,
    },
    {
      field: "sms_template",
      headerName: t("common.sms.label", {
        label: t("common.Template"),
      }),
      minWidth: 160,
    },
  ];

  return { column };
};
