import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetMailSettingOptions } from "@web/components/common/Autocomplete/hooks/useGetMailSettingOptions";

type MailSettingAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const MailSettingAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: MailSettingAutocompleteProps<P>) => {
  const { data: mailSettingOption } = useGetMailSettingOptions();

  return (
    <Autocomplete
      label={t("mailSetting.label")}
      options={mailSettingOption}
      loading={loading}
      {...props}
    />
  );
};
