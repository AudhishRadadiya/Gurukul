import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";

type DonationModeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const DonationModeAutocomplete = <P extends FieldValues>(
  props: DonationModeAutocompleteProps<P>
) => {
  const { data: donationModeOptions } = useGetDonationModeOptions();

  return (
    <Autocomplete
      label="Donation Mode"
      options={donationModeOptions}
      placeholder="Select Donation Mode"
      {...props}
    />
  );
};
