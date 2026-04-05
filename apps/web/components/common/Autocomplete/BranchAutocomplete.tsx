import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";

type BranchAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  isUserWise?: boolean;
};

export const BranchAutocomplete = <P extends FieldValues>({
  isUserWise = false,
  ...props
}: BranchAutocompleteProps<P>) => {
  const { data: branchOptions } = useGetBranchOptions({ isUserWise });

  return (
    <Autocomplete
      label="Branch"
      options={branchOptions}
      limitTags={1}
      placeholder="Select Branch"
      {...props}
    />
  );
};
