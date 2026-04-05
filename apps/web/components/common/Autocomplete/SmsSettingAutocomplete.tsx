import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetSmsSettingOptions } from "@web/components/common/Autocomplete/hooks/useGetSmsSettingOptions";

type SmsSettingAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const SmsSettingAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: SmsSettingAutocompleteProps<P>) => {
  const { data: smsSettingOption } = useGetSmsSettingOptions();

  return (
    <Autocomplete
      label={t("sms.settings.menu.label")}
      options={smsSettingOption}
      loading={loading}
      {...props}
    />
  );
};
