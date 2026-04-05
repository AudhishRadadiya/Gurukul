import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type TrustAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  useShortName?: boolean;
  useUserWise?: boolean;
};

export const TrustAutocomplete = <P extends FieldValues>({
  loading,
  useShortName,
  useUserWise,
  ...props
}: TrustAutocompleteProps<P>) => {
  const { data: trustOption } = useGetTrustOptions({
    useShortName,
    useUserWise,
  });

  return (
    <Autocomplete
      label="Allow Trust"
      limitTags={1}
      options={trustOption}
      placeholder="Select Trust"
      loading={loading}
      {...props}
    />
  );
};
