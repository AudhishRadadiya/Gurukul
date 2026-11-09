import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { MailSettingDetail } from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useMailSettingColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

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
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("common.smtp.enable"),
      maxWidth: 180,
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
