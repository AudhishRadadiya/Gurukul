import type { FieldValues } from "react-hook-form";

import {
  CommonAutocomplete,
  type CommonAutocompleteProps,
} from "@web/components/common/Autocomplete/CommonAutocomplete";

type CommonAddressBookAutocompleteProps<P extends FieldValues> = Omit<
  CommonAutocompleteProps<P>,
  "module"
>;

export const CommonAddressBookAutocomplete = <P extends FieldValues>({
  ...props
}: CommonAddressBookAutocompleteProps<P>) => {
  return <CommonAutocomplete {...props} module="address_book" />;
};
