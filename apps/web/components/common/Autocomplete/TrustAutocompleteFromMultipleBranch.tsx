import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetTrustOptionsFromMultipleBranch";

type TrustAutocompleteFromMultipleBranchProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  branchIds: string[];
};

export const TrustAutocompleteFromMultipleBranch = <P extends FieldValues>({
  branchIds,
  loading,
  ...props
}: TrustAutocompleteFromMultipleBranchProps<P>) => {
  const { data: businessUnitOptions } = useGetTrustOptionsFromMultipleBranch({
    branchIds,
  });

  return (
    <Autocomplete
      placeholder="Select Trust"
      loading={loading}
      options={businessUnitOptions}
      {...props}
    />
  );
};
