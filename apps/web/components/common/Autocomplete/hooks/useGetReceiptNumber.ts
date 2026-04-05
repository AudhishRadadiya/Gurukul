import { useQuery } from "@tanstack/react-query";

import { CANCEL_RECEIPT_ROUTES } from "@web/constants/routes/cancel_receipt/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type GetReceiptNumberResponse = {
  receipt_number: string;
  receipt_sequence: number | null;
};

export type GetReceiptNumberApiSuccessResponse =
  ApiSuccessResponse<GetReceiptNumberResponse>;

type UseGetReceiptNumberArgs = {
  branch_id: string;
  trust_id: string;
};

export function useGetReceiptNumber({
  branch_id,
  trust_id,
}: UseGetReceiptNumberArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getReceiptNumber = async ({
    branch_id,
    trust_id,
  }: UseGetReceiptNumberArgs) => {
    const { data } =
      await axiosPrivate.post<GetReceiptNumberApiSuccessResponse>(
        CANCEL_RECEIPT_ROUTES.generateReceiptNumber,
        { branch_id, trust_id }
      );

    return data.data;
  };

  const queryResult = useQuery({
    enabled: !!branch_id && !!trust_id,
    queryFn: () => getReceiptNumber({ branch_id, trust_id }),
    queryKey: cancelReceiptKeys.generateReceiptNumber(branch_id, trust_id),
  });

  return {
    ...queryResult,
    isInitialLoading: queryResult.isLoading,
  };
}
