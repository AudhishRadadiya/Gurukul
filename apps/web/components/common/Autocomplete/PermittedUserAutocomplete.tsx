import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetPermittedUsers } from "@web/components/common/Autocomplete/hooks/useGetPermittedUsers";

type PermittedUserAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const PermittedUserAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: PermittedUserAutocompleteProps<P>) => {
  const { data: permittedUserOption } = useGetPermittedUsers();

  return (
    <Autocomplete
      label="Copy User Permission"
      options={permittedUserOption}
      placeholder="Select User Permission"
      loading={loading}
      {...props}
    />
  );
};
