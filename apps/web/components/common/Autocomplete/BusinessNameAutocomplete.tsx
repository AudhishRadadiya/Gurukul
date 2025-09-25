import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetBusinessNameOptions } from "@web/components/common/Autocomplete/hooks/useGetBusinessNameOptions";

type BranchAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  contactNumber: string;
};

export const BusinessNameAutocomplete = <P extends FieldValues>({
  contactNumber,
  ...props
}: BranchAutocompleteProps<P>) => {
  const { data: branchOptions } = useGetBusinessNameOptions(contactNumber);

  return (
    <Autocomplete
      label={t("common.business.name")}
      options={branchOptions}
      placeholder={t("common.select.label", {
        label: t("common.business.name"),
      })}
      {...props}
    />
  );
};
