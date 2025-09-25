import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type TrustAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const TrustAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: TrustAutocompleteProps<P>) => {
  const { data: trustOption } = useGetTrustOptions();

  return (
    <Autocomplete
      label="Allow Trust"
      options={trustOption}
      placeholder="Select Trust"
      loading={loading}
      {...props}
    />
  );
};
