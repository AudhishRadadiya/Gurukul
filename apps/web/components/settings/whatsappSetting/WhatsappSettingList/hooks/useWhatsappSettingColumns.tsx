import { t } from "i18next";

import type { WhatsappSettingDetail } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useWhatsappSettingColumns = () => {
  const column: AgColumnsWithActions<WhatsappSettingDetail> = [
    {
      field: "whatsapp_number",
      headerName: t("common.whatsApp", { label: t("common.number.label") }),
    },
    {
      field: "whatsapp_client",
      headerName: t("common.whatsApp", { label: t("common.client.label") }),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
