import type { AutocompleteProps } from "@codezee/sixtify-brahma";
import { Autocomplete } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { FieldValues } from "react-hook-form";

import { usePaymentGatewayOptions } from "@web/components/common/Autocomplete/hooks/usePaymentGatewayOptions";

type PaymentGatewayOptionsAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options"
>;

export const PaymentGatewayOptionsAutocomplete = <P extends FieldValues>(
  props: PaymentGatewayOptionsAutocompleteProps<P>
) => {
  const { paymentGatewayOptions } = usePaymentGatewayOptions();

  return (
    <Autocomplete
      options={paymentGatewayOptions}
      placeholder={t("common.select.label", {
        label: t("payment.gateway.menu.label"),
      })}
      {...props}
    />
  );
};
