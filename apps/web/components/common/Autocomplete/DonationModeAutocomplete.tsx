import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";

type DonationModeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  isUserWiseAll?: boolean;
};

export const DonationModeAutocomplete = <P extends FieldValues>(
  {isUserWiseAll = false, ...props}: DonationModeAutocompleteProps<P>
) => {
  const { data: donationModeOptions } = useGetDonationModeOptions({
    isUserWiseAll
  });

  return (
    <Autocomplete
      label={t("donationMode.label")}
      options={donationModeOptions}
      placeholder={t("common.select.label", {
        label: t("donationMode.label"),
      })}
      {...props}
    />
  );
};
