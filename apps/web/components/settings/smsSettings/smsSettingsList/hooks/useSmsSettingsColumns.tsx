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
      maxWidth: 250,
    },
    {
      field: "sms_sender_id",
      headerName: t("common.sms.label", {
        label: t("common.sender"),
      }),
      maxWidth: 250,
    },
    {
      field: "sms_url",
      headerName: t("common.sms.label", {
        label: t("common.url"),
      }),
      minWidth: 300,
    },
    {
      field: "left_sms_count",
      headerName: t("leftSMSCount.label"),
      maxWidth: 200,
    },
  ];

  return { column };
};
