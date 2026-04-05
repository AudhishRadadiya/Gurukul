import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetEventOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetEventOptionsFromMultipleBranch";

type BranchWiseEventAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  branchIds: string[];
};

export const BranchWiseEventAutocomplete = <P extends FieldValues>({
  branchIds,
  ...props
}: BranchWiseEventAutocompleteProps<P>) => {
  const { data: eventOptions } = useGetEventOptionsFromMultipleBranch({
    branchIds,
  });

  return <Autocomplete options={eventOptions} {...props} />;
};
