import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetEventItemTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetEventItemTypeOptions";

type EventItemTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const EventItemTypeAutocomplete = <P extends FieldValues>({
  loading = false,
  ...props
}: EventItemTypeAutocompleteProps<P>) => {
  const { eventItemOptions } = useGetEventItemTypeOptions();

  return (
    <Autocomplete
      options={eventItemOptions}
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
