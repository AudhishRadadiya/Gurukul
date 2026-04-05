import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { formatToIndianNumber } from "@web/utils/helper";

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
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
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
