import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import {
  useGetMasterTypeParametersOptions,
  type MasterTypeParametersKey,
} from "@web/components/common/Autocomplete/hooks/useGetMasterTypeParametersOptions";

export type CommonMasterTypeParametersAutocompleteProps<P extends FieldValues> =
  Omit<
    AutocompleteProps<P>,
    "options" & {
      loading?: boolean;
    }
  > & {
    optionsKey: MasterTypeParametersKey;
  };

export const CommonMasterTypeParametersAutocomplete = <P extends FieldValues>({
  loading,
  optionsKey,
  ...props
}: CommonMasterTypeParametersAutocompleteProps<P>) => {
  const { data: parametersOptions } = useGetMasterTypeParametersOptions();

  return (
    <Autocomplete
      options={parametersOptions[optionsKey]}
      loading={loading}
      {...props}
    />
  );
};
