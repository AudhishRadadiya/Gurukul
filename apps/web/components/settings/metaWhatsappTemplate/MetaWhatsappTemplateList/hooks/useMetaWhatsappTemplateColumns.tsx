import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { MetaWhatsappTemplateDetail } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/hooks/useGetMetaWhatsappTemplate";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useMetaWhatsappTemplateColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<MetaWhatsappTemplateDetail> = [
    {
      field: "meta_whatsapp_number",
      headerName: t("metaWhatsappTemplate.metaWhatsappNumber.label"),
    },
    {
      field: "template_id",
      headerName: t("metaWhatsappTemplate.templateId.label"),
    },
    {
      field: "template_name",
      headerName: t("metaWhatsappTemplate.templateName.label"),
    },
    {
      field: "module_name",
      headerName: t("metaWhatsappTemplate.moduleName.label"),
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
