import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetEventDropdownFieldTypeOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownFieldTypeOptions";

type EventDropdownFieldTypeAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const EventDropdownFieldTypeAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: EventDropdownFieldTypeAutocompleteProps<P>) => {
  const { eventDropdownFieldTypeOptions } =
    useGetEventDropdownFieldTypeOptions();

  return (
    <Autocomplete
      label={t("fieldType.label")}
      options={eventDropdownFieldTypeOptions}
      loading={loading}
      {...props}
    />
  );
};
