import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetUserOptions } from "@web/components/common/Autocomplete/hooks/useGetUserOptions";

type UserAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const UserAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: UserAutocompleteProps<P>) => {
  const { data: userOption } = useGetUserOptions();

  return (
    <Autocomplete
      label="User"
      options={userOption}
      placeholder="Select User"
      loading={loading}
      {...props}
    />
  );
};
