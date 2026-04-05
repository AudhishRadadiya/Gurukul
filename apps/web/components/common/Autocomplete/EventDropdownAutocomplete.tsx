import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetEventDropdownOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownOptions";

type EventDropdownAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  eventMasterId: string | null;
};

export const EventDropdownAutocomplete = <P extends FieldValues>(
  props: EventDropdownAutocompleteProps<P>
) => {
  const { eventMasterId, ...autocompleteProps } = props;

  const { data: eventDropdownOptions } = useGetEventDropdownOptions({
    eventMasterId: eventMasterId ?? "",
  });

  return (
    <Autocomplete
      label={t("common.event.dropdown")}
      limitTags={1}
      options={eventDropdownOptions}
      placeholder={t("common.select.label", {
        label: t("common.event.dropdown"),
      })}
      disabled={!eventMasterId}
      {...autocompleteProps}
    />
  );
};
