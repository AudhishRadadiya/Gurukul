import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetCityOptions } from "@web/components/common/Autocomplete/hooks/useGetCityOptions";

type CityAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const CityAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: CityAutocompleteProps<P>) => {
  const { data: cityOption } = useGetCityOptions();

  return (
    <Autocomplete
      label={t("common.city")}
      options={cityOption}
      loading={loading}
      {...props}
    />
  );
};
