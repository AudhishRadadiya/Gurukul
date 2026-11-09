import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetEventContactDetailNameOptions } from "@web/components/common/Autocomplete/hooks/useGetEventContactDetailNameOptions";

type EventContactDetailNameAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const EventContactDetailNameAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: EventContactDetailNameAutocompleteProps<P>) => {
  const { data: eventContactDetailNameOptions } =
    useGetEventContactDetailNameOptions();

  return (
    <Autocomplete
      label="Event Contact Group"
      options={eventContactDetailNameOptions}
      loading={loading}
      placeholder="Select Event Contact Group"
      {...props}
    />
  );
};
