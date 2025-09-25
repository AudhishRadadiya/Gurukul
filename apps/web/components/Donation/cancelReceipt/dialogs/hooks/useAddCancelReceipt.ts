import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CancelReceiptFormFieldValues } from "@web/components/Donation/cancelReceipt/dialogs/CancelReceiptFrom";
import { CANCEL_RECEIPT_ROUTES } from "@web/constants/routes/cancel_receipt/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { cancelReceiptKeys } from "@web/queryKeysFactories/cancelReceipt";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type AddCancelReceiptApiSuccessResponse = ApiSuccessResponse<null>;

type UseAddCancelReceiptArgs = {
  options: UseMutationOptions<
    AddCancelReceiptApiSuccessResponse,
    ApiErrorResponse<CancelReceiptFormFieldValues>,
    Partial<CancelReceiptFormFieldValues>
  >;
};

export function useAddCancelReceipt({ options = {} }: UseAddCancelReceiptArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddCancelReceiptApiSuccessResponse>(
          CANCEL_RECEIPT_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: cancelReceiptKeys.add(),
    ...options,
  });
}
