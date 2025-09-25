import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";

import { useGetMasterEntryOptions } from "@web/components/common/Autocomplete/hooks/useGetMasterEntryOptions";

type MasterEntryAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  loading?: boolean;
  name: Path<P>;
  setValue: UseFormSetValue<P>;
};

export const MasterEntryAutocomplete = <P extends FieldValues>({
  loading,
  name,
  setValue,
  ...props
}: MasterEntryAutocompleteProps<P>) => {
  const { data: masterEntryOption } = useGetMasterEntryOptions();

  return (
    <Autocomplete
      name={name}
      label="Master Entry"
      options={masterEntryOption}
      placeholder="Select Master Entry"
      loading={loading}
      onInputChange={(_, newValue, reason) => {
        if (reason === "input") {
          setValue(name, newValue as PathValue<P, Path<P>>, {
            shouldDirty: false,
            shouldValidate: false,
          });
        } else if (!newValue) {
          setValue(name, null as PathValue<P, Path<P>>);
        }
      }}
      {...props}
    />
  );
};
