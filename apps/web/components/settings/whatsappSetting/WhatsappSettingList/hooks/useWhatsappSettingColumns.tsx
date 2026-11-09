import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { WhatsappSettingDetail } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useWhatsappSettingColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

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
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
