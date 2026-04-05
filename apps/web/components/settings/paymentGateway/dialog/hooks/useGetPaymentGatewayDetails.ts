import { useQuery } from "@tanstack/react-query";

import type { PaymentGatewayFormFieldValues } from "@web/components/settings/paymentGateway/dialog/PaymentGatewayForm";
import type { PaymentGatewayDetail } from "@web/components/settings/paymentGateway/paymentGatewayList/hooks/useGetPaymentGateway";
import { PAYMENT_GATEWAY_ROUTES } from "@web/constants/routes/payment_gateway/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { paymentGatewayKeys } from "@web/queryKeysFactories/paymentGateway";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type UseGetPaymentGatewayDetailsArgs = {
  paymentGatewayId: PaymentGatewayDetail["payment_gateway_id"];
};

export function useGetPaymentGatewayDetails({
  paymentGatewayId,
}: UseGetPaymentGatewayDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchPaymentGatewayDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<PaymentGatewayFormFieldValues>
    >(PAYMENT_GATEWAY_ROUTES.get(paymentGatewayId));

    return data;
  };

  return useQuery({
    enabled: !!paymentGatewayId,
    queryFn: fetchPaymentGatewayDetails,
    queryKey: paymentGatewayKeys.get(paymentGatewayId),
  });
}
