import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { CANCEL_RECEIPT_ROUTES } from "@web/constants/routes/cancel_receipt/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type CancelReceipt = {
  amount: number;
  cancel_date: string;
  date: string;
  donation_id: string;
  entry_by: string;
  full_count: string;
  receipt_no: number;
  trust_name: string;
  user: string;
};

export type GetCancelReceiptSuccessResponse = ApiSuccessResponse<{
  cancelDonations: CancelReceipt[];
  full_count: number;
}>;

type GetCancelReceiptListArgs = Partial<
  IGetRowsParams & {
    endRow: number;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
  }
>;

export function useGetCancelReceipt(body: GetCancelReceiptListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getCancelReceipt = async (body: GetCancelReceiptListArgs) => {
    const { data } = await axiosPrivate.post<GetCancelReceiptSuccessResponse>(
      CANCEL_RECEIPT_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      cancelDonations: [],
      full_count: 0,
    },
    queryFn: () => getCancelReceipt(body),
    queryKey: cancelReceiptKeys.listing(body),
  });
}
