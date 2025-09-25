import type { AutocompleteProps } from "@codezee/sixtify-brahma";
import { Autocomplete } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetBankOptionsFromTrust } from "@web/components/common/Autocomplete/hooks/useGetBankOptionsFromTrust";

type BankAutocompleteFromTrustProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  trustId?: string;
};

export const BankAutocompleteFromTrust = <P extends FieldValues>({
  trustId,
  ...props
}: BankAutocompleteFromTrustProps<P>) => {
  const { data: bankOptions } = useGetBankOptionsFromTrust({
    trustId,
  });

  return (
    <Autocomplete
      label="Bank"
      options={bankOptions}
      placeholder="Select Bank"
      {...props}
    />
  );
};
