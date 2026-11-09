import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useGetAllowedFieldsOptions } from "@web/components/common/Autocomplete/hooks/useGetAllowedFieldsOptions";

type AllowedFieldsAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const AllowedFieldsAutocomplete = <P extends FieldValues>(
  props: AllowedFieldsAutocompleteProps<P>
) => {
  const { t } = useTranslation();

  const { allowedFieldsOptions } = useGetAllowedFieldsOptions();

  return (
    <Autocomplete
      options={allowedFieldsOptions}
      placeholder={t("common.select.label", {
        label: t("common.allowed.fields.label"),
      })}
      {...props}
    />
  );
};
