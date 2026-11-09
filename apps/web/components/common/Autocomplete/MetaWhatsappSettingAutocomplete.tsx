import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetMetaWhatsappSettingOptions } from "@web/components/common/Autocomplete/hooks/useGetMetaWhatsappSettingOptions";

type MetaWhatsappSettingAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const MetaWhatsappSettingAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: MetaWhatsappSettingAutocompleteProps<P>) => {
  const { data: metaWhatsappSettingOptions } =
    useGetMetaWhatsappSettingOptions();

  return (
    <Autocomplete
      label={t("metaWhatsappTemplate.metaWhatsappSetting.label")}
      options={metaWhatsappSettingOptions}
      loading={loading}
      placeholder={t("common.select.label", {
        label: t("metaWhatsappTemplate.metaWhatsappSetting.label"),
      })}
      {...props}
    />
  );
};
