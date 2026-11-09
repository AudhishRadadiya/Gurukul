import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetMetaWhatsappModuleOptions } from "@web/components/common/Autocomplete/hooks/useGetMetaWhatsappModuleOptions";

type MetaWhatsappModuleAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
};

export const MetaWhatsappModuleAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: MetaWhatsappModuleAutocompleteProps<P>) => {
  const { metaWhatsappModuleOptions } = useGetMetaWhatsappModuleOptions();

  return (
    <Autocomplete
      label={t("metaWhatsappTemplate.moduleName.label")}
      options={metaWhatsappModuleOptions}
      loading={loading}
      placeholder={t("common.select.label", {
        label: t("metaWhatsappTemplate.moduleName.label"),
      })}
      {...props}
    />
  );
};
