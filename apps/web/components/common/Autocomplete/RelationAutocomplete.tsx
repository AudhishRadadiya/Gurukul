import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetRelationOptions } from "@web/components/common/Autocomplete/hooks/useGetRelationOptions";

type RelationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const RelationAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: RelationAutocompleteProps<P>) => {
  const { relationOptions } = useGetRelationOptions();

  return (
    <Autocomplete
      options={relationOptions}
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
