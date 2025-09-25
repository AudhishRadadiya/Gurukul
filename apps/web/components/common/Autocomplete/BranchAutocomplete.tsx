import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";

type BranchAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const BranchAutocomplete = <P extends FieldValues>(
  props: BranchAutocompleteProps<P>
) => {
  const { data: branchOptions } = useGetBranchOptions();

  return (
    <Autocomplete
      label="Branch"
      options={branchOptions}
      placeholder="Select Branch"
      {...props}
    />
  );
};
