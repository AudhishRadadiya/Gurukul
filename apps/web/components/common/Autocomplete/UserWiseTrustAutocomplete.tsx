import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetUserWiseTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetUserWiseTrustOptions";

type UserWiseTrustAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const UserWiseTrustAutocomplete = <P extends FieldValues>({
  ...props
}: UserWiseTrustAutocompleteProps<P>) => {
  const { data: userWiseTrustOption } = useGetUserWiseTrustOptions();

  return (
    <Autocomplete
      label={t("common.allow.label", {
        label: t("trust.label"),
      })}
      options={userWiseTrustOption}
      {...props}
    />
  );
};
