import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetRolesOptions } from "@web/components/common/Autocomplete/hooks/useGetRolesOptions";

type RolesAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const RolesAutocomplete = <P extends FieldValues>(
  props: RolesAutocompleteProps<P>
) => {
  const { data: rolesOptions } = useGetRolesOptions();

  return (
    <Autocomplete
      label={t("role.menu.label")}
      options={rolesOptions}
      {...props}
    />
  );
};
