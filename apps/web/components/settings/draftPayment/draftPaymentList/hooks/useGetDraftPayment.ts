import { useQuery } from "@tanstack/react-query";

import { DRAFT_PAYMENT_ROUTES } from "@web/constants/routes/draft_payment/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { draftPaymentKeys } from "@web/queryKeysFactories/draftPayment";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type TempPaymentDetails = {
  branch_name: string;
  contact_no: string;
  date: string;
  event_name: string;
  full_count: string;
  temp_payment_detail_id: string;
  total_amount: number;
};

export type GetDraftPaymentSuccessResponse = ApiSuccessResponse<{
  tempPaymentDetails: TempPaymentDetails[];
  totalCount: number;
}>;

export function useGetDraftPayment(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDraftPayment = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetDraftPaymentSuccessResponse>(
      DRAFT_PAYMENT_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { tempPaymentDetails: [], totalCount: 0 },
    queryFn: () => getDraftPayment(body),
    queryKey: draftPaymentKeys.listing(body),
  });
}
