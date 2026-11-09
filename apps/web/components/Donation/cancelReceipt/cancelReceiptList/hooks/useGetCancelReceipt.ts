import { useQuery } from "@tanstack/react-query";
import _every from "lodash/every";
import _get from "lodash/get";

import { CANCEL_RECEIPT_ROUTES } from "@web/constants/routes/cancel_receipt/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type CancelReceipt = {
  amount: number;
  cancel_date: string;
  date: string;
  donation_id: string;
  entry_by: string;
  full_count: string;
  receipt_no: number;
  receipt_sequence: string;
  trust_name: string;
  user: string;
};

export type GetCancelReceiptSuccessResponse = ApiSuccessResponse<{
  cancelDonations: CancelReceipt[];
  full_count: number;
}>;

export function useGetCancelReceipt(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getCancelReceipt = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetCancelReceiptSuccessResponse>(
      CANCEL_RECEIPT_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    enabled: _every(_get(body, "externalFilter.branch_id"), Boolean),
    initialData: {
      cancelDonations: [],
      full_count: 0,
    },
    queryFn: () => getCancelReceipt(body),
    queryKey: cancelReceiptKeys.listing(body),
  });
}
