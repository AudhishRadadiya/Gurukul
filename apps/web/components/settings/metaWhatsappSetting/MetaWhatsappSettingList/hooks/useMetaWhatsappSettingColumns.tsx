import { t } from "i18next";

import { useGetTrueFalseOptions } from "@web/components/common/Autocomplete/hooks/useGetTrueFalseOptions";
import type { MetaWhatsappSettingDetail } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/hooks/useGetMetaWhatsappSetting";
import type { AgColumnsWithActions } from "@web/types/agGrid";
import { CustomEnumFilter } from "@web/utils/ag-grid-custom-filter";

export const useMetaWhatsappSettingColumns = () => {
  const { trueFalseOptions } = useGetTrueFalseOptions();

  const column: AgColumnsWithActions<MetaWhatsappSettingDetail> = [
    {
      field: "title",
      headerName: t("title.label"),
    },
    {
      field: "phone_number_id",
      headerName: t("metaWhatsappSetting.phoneNumberId.label"),
    },
    {
      field: "waba_id",
      headerName: t("metaWhatsappSetting.wabaId.label"),
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
    {
      field: "is_deleted",
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: trueFalseOptions,
        source: "server",
      },
      headerName: t("isDeleted.label"),
      maxWidth: 180,
    },
  ];

  return { column };
};
