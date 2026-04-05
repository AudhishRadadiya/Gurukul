import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";

type FilterEventAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  isUserWise?: boolean;
};

export const FilterEventAutocomplete = <P extends FieldValues>(
  props: FilterEventAutocompleteProps<P>
) => {
  const { isUserWise = false, ...autocompleteProps } = props;

  const { data: filterEventOptions } = useGetFilterEventOptions({ isUserWise });

  return (
    <Autocomplete
      label={t("common.event.label")}
      limitTags={1}
      options={filterEventOptions}
      placeholder={t("common.select.label", {
        label: t("common.event.label"),
      })}
      {...autocompleteProps}
    />
  );
};
