import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import {
  ALL_META_WHATSAPP_TEMPLATE_VARIABLES,
  useGetMetaWhatsappTemplateVariablesOptions,
  type MetaWhatsappTemplateVariablesScope,
} from "@web/components/common/Autocomplete/hooks/useGetMetaWhatsappTemplateVariablesOptions";

type MetaWhatsappTemplateVariablesAutocompleteProps<P extends FieldValues> =
  Omit<AutocompleteProps<P>, "options"> & {
    loading?: boolean;
    templateType?: MetaWhatsappTemplateVariablesScope;
  };

export const MetaWhatsappTemplateVariablesAutocomplete = <
  P extends FieldValues,
>({
  loading = false,
  templateType = ALL_META_WHATSAPP_TEMPLATE_VARIABLES,
  ...props
}: MetaWhatsappTemplateVariablesAutocompleteProps<P>) => {
  const { metaWhatsappTemplateVariablesOptions } =
    useGetMetaWhatsappTemplateVariablesOptions(templateType);

  return (
    <Autocomplete
      options={metaWhatsappTemplateVariablesOptions}
      placeholder="Select Option"
      loading={loading}
      clearIcon
      {...props}
    />
  );
};
