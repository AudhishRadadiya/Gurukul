import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetClassMateOptions } from "@web/components/common/Autocomplete/hooks/useGetClassMateOptions";

type ClassMateAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const ClassMateAutocomplete = <P extends FieldValues>(
  props: ClassMateAutocompleteProps<P>
) => {
  const { data: classMateOptions } = useGetClassMateOptions();

  return (
    <Autocomplete
      label={t("common.class.mate")}
      options={classMateOptions}
      {...props}
    />
  );
};
