import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { useGetBankNameOptions } from "@web/components/common/Autocomplete/hooks/useGetBankNameOptions";

type BankNameAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const BankNameAutocomplete = <P extends FieldValues>(
  props: BankNameAutocompleteProps<P>
) => {
  const { data: bankOptions } = useGetBankNameOptions();

  return (
    <Autocomplete
      label={t("bank.name.label")}
      options={bankOptions}
      placeholder={t("common.select.label", {
        label: t("bank.name.label"),
      })}
      {...props}
    />
  );
};
