import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetStatusOptions } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";

type StatusAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const StatusAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: StatusAutocompleteProps<P>) => {
  const { statusOptions } = useGetStatusOptions();

  return (
    <Autocomplete
      sx={{ width: "160px" }}
      options={statusOptions}
      placeholder="Select Option"
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
