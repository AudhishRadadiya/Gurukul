import type { CustomCellRendererProps } from "ag-grid-react";
import { t } from "i18next";

import { AG_GRID_CELL_DEFAULT_VALUE } from "@web/components/common/AgGridV2/AgGridV2";
import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";
import { formatToIndianNumber } from "@web/utils/helper";

export const useSmsTemplateColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

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
      filter: "agNumberColumnFilter",
      headerName: t("common.template.type"),
    },
    {
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        return !value
          ? AG_GRID_CELL_DEFAULT_VALUE
          : formatToIndianNumber(value);
      },
      field: "donation_amount",
      filter: "agNumberColumnFilter",
      headerName: t("common.donation.amount"),
    },
    {
      field: "is_active",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isActive.label"),
    },
  ];

  return { column };
};
