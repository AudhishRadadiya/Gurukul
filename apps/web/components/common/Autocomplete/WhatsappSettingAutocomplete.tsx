import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetWhatsappSettingOptions } from "@web/components/common/Autocomplete/hooks/useGetWhatsappSettingOptions";

type WhatsappSettingAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const WhatsappSettingAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: WhatsappSettingAutocompleteProps<P>) => {
  const { data: whatsappSettingOption } = useGetWhatsappSettingOptions();

  return (
    <Autocomplete
      label={t("whatsappSetting.label")}
      options={whatsappSettingOption}
      loading={loading}
      {...props}
    />
  );
};
