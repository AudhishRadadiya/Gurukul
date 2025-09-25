import { t } from "i18next";

import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import type { AgColumnsWithActions } from "@web/types/agGrid";

export const useSmsTemplateColumns = () => {
  const column: AgColumnsWithActions<SmsTemplateDetail> = [
    {
      field: "template_name",
      headerName: t("common.template.name"),
    },
    {
      field: "template_parameter_text",
      headerName: t("common.sms.text"),
    },
    {
      field: "template_type",
      headerName: t("common.template.type"),
    },
    {
      field: "donation_amount",
      headerName: t("common.donation.amount"),
    },
    {
      field: "is_active",
      headerName: t("isActive.label"),
    },
  ];

  return { column };
};
