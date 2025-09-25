import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import type { TemplateType } from "@web/components/common/Autocomplete/hooks/useGetTemplateParametersOptions";
import { useGetTemplateParametersOptions } from "@web/components/common/Autocomplete/hooks/useGetTemplateParametersOptions";

type TemplateParametersAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  templateType: TemplateType;
};

export const TemplateParametersAutocomplete = <P extends FieldValues>({
  loading = false,
  templateType,
  ...props
}: TemplateParametersAutocompleteProps<P>) => {
  const { templateParametersOptions } =
    useGetTemplateParametersOptions(templateType);

  return (
    <Autocomplete
      options={templateParametersOptions}
      placeholder="Select Option"
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
