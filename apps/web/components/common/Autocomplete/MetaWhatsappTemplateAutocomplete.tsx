import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useFetchMetaWhatsappTemplateOptions } from "@web/components/settings/metaWhatsappTemplate/dialogs/hooks/useFetchMetaWhatsappTemplateOptions";

type MetaWhatsappTemplateAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  metaWhatsappSettingId: string | null;
};

export const MetaWhatsappTemplateAutocomplete = <P extends FieldValues>({
  loading,
  metaWhatsappSettingId,
  ...props
}: MetaWhatsappTemplateAutocompleteProps<P>) => {
  const { data: templateOptions, isFetching: loadingTemplateOptions } =
    useFetchMetaWhatsappTemplateOptions({
      metaWhatsappSettingId,
    });

  return (
    <Autocomplete
      label={t("metaWhatsappTemplate.template.label")}
      options={templateOptions}
      loading={loading || loadingTemplateOptions}
      disabled={!metaWhatsappSettingId}
      placeholder={t("common.select.label", {
        label: t("metaWhatsappTemplate.template.label"),
      })}
      {...props}
    />
  );
};
