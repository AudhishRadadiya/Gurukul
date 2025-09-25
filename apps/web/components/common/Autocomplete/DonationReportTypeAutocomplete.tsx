import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetDonationReportTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationReportTypeOptions";

type DonationReportTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const DonationReportTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: DonationReportTypeAutocompleteProps<P>) => {
  const { donationReportTypeOptions } = useGetDonationReportTypeOptions();

  return (
    <Autocomplete
      label={t("donation.report.menu.label")}
      options={donationReportTypeOptions}
      loading={loading}
      {...props}
    />
  );
};
