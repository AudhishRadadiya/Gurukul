import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import type {
  GeneralModule,
  GeneralOptionsKey,
} from "@web/components/common/Autocomplete/hooks/useGetGeneralOptions";
import { useGetGeneralOptions } from "@web/components/common/Autocomplete/hooks/useGetGeneralOptions";

export type CommonAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
> & {
  last_five_days?: boolean;
  module: GeneralModule;
  optionsKey: GeneralOptionsKey;
};

export const CommonAutocomplete = <P extends FieldValues>({
  last_five_days = false,
  loading,
  module,
  optionsKey,
  ...props
}: CommonAutocompleteProps<P>) => {
  const { data: donorOptions } = useGetGeneralOptions({
    last_five_days,
    module,
  });

  return (
    <Autocomplete
      options={donorOptions[optionsKey]}
      loading={loading}
      {...props}
    />
  );
};
