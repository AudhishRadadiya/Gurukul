import {
  Autocomplete,
  type AutocompleteProps,
  type OptionsType,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetFinancialYearOptions } from "@web/components/common/Autocomplete/hooks/useGetFinancialYearOptions";

type FinancialYearAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const FinancialYearAutocomplete = <P extends FieldValues>(
  props: FinancialYearAutocompleteProps<P>
) => {
  const { data: financialYearOptions } =
    useGetFinancialYearOptions<OptionsType>({
      segment: "option",
    });

  return (
    <Autocomplete
      label={t("apply.in.selected.year.label")}
      options={financialYearOptions}
      {...props}
    />
  );
};
