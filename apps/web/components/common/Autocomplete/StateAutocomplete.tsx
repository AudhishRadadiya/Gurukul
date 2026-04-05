import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetStateOptions } from "@web/components/common/Autocomplete/hooks/useGetStateOptions";

type StateAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const StateAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: StateAutocompleteProps<P>) => {
  const { data: stateOption } = useGetStateOptions();

  return (
    <Autocomplete
      label={t("state.label")}
      options={stateOption}
      loading={loading}
      {...props}
    />
  );
};
