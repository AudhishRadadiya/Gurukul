import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetUserTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetUserTypeOptions";

type UserTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const UserTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: UserTypeAutocompleteProps<P>) => {
  const { userTypeOption } = useGetUserTypeOptions();

  return (
    <Autocomplete
      label="User Type"
      options={userTypeOption}
      placeholder="Select User"
      loading={loading}
      {...props}
    />
  );
};
