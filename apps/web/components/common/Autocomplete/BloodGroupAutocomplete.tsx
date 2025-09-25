import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetBloodGroupOptions } from "@web/components/common/Autocomplete/hooks/useGetBloodGroupOptions";

type BloodGroupAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const BloodGroupAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: BloodGroupAutocompleteProps<P>) => {
  const { bloodGroupOptions } = useGetBloodGroupOptions();

  return (
    <Autocomplete
      options={bloodGroupOptions}
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
