import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { UseGetPaymentGatewayDetailsArgs } from "@web/components/settings/paymentGateway/dialog/hooks/useGetPaymentGatewayDetails";
import type { PaymentGatewayFormFieldValues } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { PAYMENT_GATEWAY_ROUTES } from "@web/constants/routes/payment_gateway/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { paymentGatewayKeys } from "@web/queryKeysFactories/paymentGateway";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditPaymentGatewayArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<PaymentGatewayFormFieldValues>,
    Partial<PaymentGatewayFormFieldValues>
  >;
} & UseGetPaymentGatewayDetailsArgs;

export function useEditPaymentGateway({
  options = {},
  paymentGatewayId,
}: UseEditPaymentGatewayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        PAYMENT_GATEWAY_ROUTES.patch(paymentGatewayId),
        formValues
      );

      return data;
    },
    mutationKey: paymentGatewayKeys.edit(paymentGatewayId),
    ...options,
  });
}
