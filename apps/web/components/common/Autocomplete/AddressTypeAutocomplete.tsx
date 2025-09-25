import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetAddressTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetAddressTypeOptions";

type AddressTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const AddressTypeAutocomplete = <P extends FieldValues>(
  props: AddressTypeAutocompleteProps<P>
) => {
  const { data: financialYearOptions } = useGetAddressTypeOptions();

  return (
    <Autocomplete
      label="Address Type"
      options={financialYearOptions}
      placeholder="Select Address Type"
      {...props}
    />
  );
};
