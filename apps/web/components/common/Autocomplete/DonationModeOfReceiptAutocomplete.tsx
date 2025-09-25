import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetDonationModeOfReceiptOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOfReceiptOptions";

type DonationModeOfReceiptAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const DonationModeOfReceiptAutocomplete = <P extends FieldValues>(
  props: DonationModeOfReceiptAutocompleteProps<P>
) => {
  const { data: donationModeOfReceiptOptions } =
    useGetDonationModeOfReceiptOptions();

  return (
    <Autocomplete
      label={t("mode.of.receipt.label")}
      options={donationModeOfReceiptOptions}
      placeholder={t("common.select.label", {
        label: t("mode.of.receipt.label"),
      })}
      {...props}
    />
  );
};
