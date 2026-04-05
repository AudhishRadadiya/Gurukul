import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { PaymentGatewayFormFieldValues } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import { PAYMENT_GATEWAY_ROUTES } from "@web/constants/routes/payment_gateway/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { paymentGatewayKeys } from "@web/queryKeysFactories/paymentGateway";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddPaymentGatewayArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<PaymentGatewayFormFieldValues>,
    Partial<PaymentGatewayFormFieldValues>
  >;
};

export function useAddPaymentGateway({
  options = {},
}: UseAddPaymentGatewayArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        PAYMENT_GATEWAY_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: paymentGatewayKeys.add(),
    ...options,
  });
}
