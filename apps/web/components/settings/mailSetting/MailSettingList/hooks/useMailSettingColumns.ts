import { t } from "i18next";

import type { MailSettingDetail } from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useMailSettingColumns = () => {
  const column: AgColumnsWithActions<MailSettingDetail> = [
    {
      field: "sender_email",
      headerName: t("common.sender.mail"),
    },
    {
      field: "smtp_server",
      headerName: t("common.smtp.server"),
    },
    {
      field: "smtp_enable",
      headerName: t("common.smtp.enable"),
      maxWidth: 180,
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
