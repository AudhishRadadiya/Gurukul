import { useQuery } from "@tanstack/react-query";

import { PAYMENT_GATEWAY_ROUTES } from "@web/constants/routes/payment_gateway/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { paymentGatewayKeys } from "@web/queryKeysFactories/paymentGateway";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type PaymentGatewayDetail = {
  branch_name: string;
  full_count: string;
  gateway_name: string;
  is_test_mode: boolean;
  notes: string;
  payment_gateway_id: string;
  trust_name: string;
};

export type GetPaymentGatewaySuccessResponse = ApiSuccessResponse<{
  paymentGatewayList: PaymentGatewayDetail[];
  totalCount: number;
}>;

export function useGetPaymentGateway(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getPaymentGateway = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetPaymentGatewaySuccessResponse>(
      PAYMENT_GATEWAY_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { paymentGatewayList: [], totalCount: 0 },
    queryFn: () => getPaymentGateway(body),
    queryKey: paymentGatewayKeys.listing(body),
  });
}
