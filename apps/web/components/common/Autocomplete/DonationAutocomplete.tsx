import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetDonationOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationOptions";

type DonationAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const DonationAutocomplete = <P extends FieldValues>(
  props: DonationAutocompleteProps<P>
) => {
  const { data: donationOptions } = useGetDonationOptions();

  return (
    <Autocomplete
      label={t("donation.menu.label")}
      options={donationOptions}
      placeholder={t("common.select.label", {
        label: t("donation.menu.label"),
      })}
      {...props}
    />
  );
};
