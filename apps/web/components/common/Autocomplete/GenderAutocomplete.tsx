// @web/components/common/Autocomplete/GenderAutocomplete.tsx

import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetGenderOptions } from "@web/components/common/Autocomplete/hooks/useGetGenderOptions";

type GenderAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const GenderAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: GenderAutocompleteProps<P>) => {
  const { genderOptions } = useGetGenderOptions();

  return (
    <Autocomplete
      options={genderOptions}
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
