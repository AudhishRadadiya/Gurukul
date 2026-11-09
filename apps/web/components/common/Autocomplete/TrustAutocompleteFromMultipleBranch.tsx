import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetTrustOptionsFromMultipleBranch";

type TrustAutocompleteFromMultipleBranchProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
> & {
  branchIds: string[];
};

export const TrustAutocompleteFromMultipleBranch = <P extends FieldValues>({
  branchIds,
  loading,
  ...props
}: TrustAutocompleteFromMultipleBranchProps<P>) => {
  const { data: businessUnitOptions } = useGetTrustOptionsFromMultipleBranch({
    branchIds,
  });

  return (
    <Autocomplete
      placeholder={t("common.select.label", {
        label: t("trust.label"),
      })}
      loading={loading}
      options={businessUnitOptions}
      {...props}
    />
  );
};
