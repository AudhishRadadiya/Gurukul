import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetSmsMasterOptions } from "@web/components/common/Autocomplete/hooks/useGetSmsMasterOptions";

type SmsMasterAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const SmsMasterAutocomplete = <P extends FieldValues>(
  props: SmsMasterAutocompleteProps<P>
) => {
  const { data: smsMasterOptions } = useGetSmsMasterOptions();

  return (
    <Autocomplete
      label={t("common.sms.label", {
        label: t("common.master"),
      })}
      options={smsMasterOptions}
      {...props}
    />
  );
};
