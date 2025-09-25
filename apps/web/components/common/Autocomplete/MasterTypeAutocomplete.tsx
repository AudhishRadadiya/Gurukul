import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetMasterTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetMasterTypeOptions";

type MasterTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const MasterTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: MasterTypeAutocompleteProps<P>) => {
  const { data: masterTypeOption } = useGetMasterTypeOptions();

  return (
    <Autocomplete
      label="Master Type"
      options={masterTypeOption}
      placeholder="Select Master Type"
      loading={loading}
      {...props}
    />
  );
};
