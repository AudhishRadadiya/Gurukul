import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useDateFilterPeriodOptions } from "@web/components/common/Autocomplete/hooks/useDateFilterPeriodOptions";

type DateFilterPeriodAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const DateFilterPeriodAutocomplete = <P extends FieldValues>(
  props: DateFilterPeriodAutocompleteProps<P>
) => {
  const { dateFilterPeriodOptions } = useDateFilterPeriodOptions();

  return (
    <Autocomplete
      options={dateFilterPeriodOptions}
      placeholder="Select Bank"
      {...props}
    />
  );
};
