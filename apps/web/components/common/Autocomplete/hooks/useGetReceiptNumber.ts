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
  donation_mode_id: string;
  trust_id: string;
};

export function useGetReceiptNumber({
  donation_mode_id,
  trust_id,
}: UseGetReceiptNumberArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getReceiptNumber = async ({
    donation_mode_id,
    trust_id,
  }: UseGetReceiptNumberArgs) => {
    const { data } =
      await axiosPrivate.post<GetReceiptNumberApiSuccessResponse>(
        CANCEL_RECEIPT_ROUTES.generateReceiptNumber,
        { donation_mode_id, trust_id }
      );

    return data.data;
  };

  const queryResult = useQuery({
    enabled: !!donation_mode_id && !!trust_id,
    queryFn: () => getReceiptNumber({ donation_mode_id, trust_id }),
    queryKey: cancelReceiptKeys.generateReceiptNumber(
      donation_mode_id,
      trust_id
    ),
  });

  return {
    ...queryResult,
    isInitialLoading: queryResult.isLoading,
  };
}
