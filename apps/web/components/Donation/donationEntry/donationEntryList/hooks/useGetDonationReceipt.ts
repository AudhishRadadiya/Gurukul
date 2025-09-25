import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";

type GetDonationReceiptPayload = {
  pdfUrl: string;
};

export type GetDonationReceiptApiSuccessResponse =
  ApiSuccessResponse<GetDonationReceiptPayload>;

type GetDonationReceiptArgs = {
  donation_id: string;
};

type UseGetDonationReceiptArgs = {
  options: UseMutationOptions<
    GetDonationReceiptApiSuccessResponse,
    ApiErrorResponse<GetDonationReceiptPayload>,
    GetDonationReceiptArgs
  >;
};

export function useGetDonationReceipt({
  options = {},
}: UseGetDonationReceiptArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ donation_id }) => {
      const { data } =
        await axiosPrivate.post<GetDonationReceiptApiSuccessResponse>(
          DONATION_ROUTES.donationReceipt,
          { donation_id }
        );

      return data;
    },
    mutationKey: donationEntryKeys.donationReceipt(),
    ...options,
  });
}
