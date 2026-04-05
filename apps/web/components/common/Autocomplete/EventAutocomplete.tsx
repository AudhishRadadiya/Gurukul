import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetEventOptions } from "@web/components/common/Autocomplete/hooks/useGetEventOptions";

type EventAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  isUserWise?: boolean;
};

export const EventAutocomplete = <P extends FieldValues>(
  props: EventAutocompleteProps<P>
) => {
  const { isUserWise = false, ...autocompleteProps } = props;

  const { data: eventOptions } = useGetEventOptions({ isUserWise });

  return (
    <Autocomplete
      label={t("common.event.label")}
      limitTags={1}
      options={eventOptions}
      placeholder={t("common.select.label", {
        label: t("common.event.label"),
      })}
      {...autocompleteProps}
    />
  );
};
