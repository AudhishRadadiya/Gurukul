import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";

type GetDonationAddressPayload = {
  pdfUrl: string;
};

export type GetDonationAddressPdfApiSuccessResponse =
  ApiSuccessResponse<GetDonationAddressPayload>;

type UseGetDonationAddressPdfArgs = {
  donationIds: string[];
  options: UseMutationOptions<
    GetDonationAddressPdfApiSuccessResponse,
    ApiErrorResponse<GetDonationAddressPayload>
  >;
};

export function useGetDonationAddressPdf({
  donationIds,
  options = {},
}: UseGetDonationAddressPdfArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.post<GetDonationAddressPdfApiSuccessResponse>(
          DONATION_ROUTES.printAddress,
          { donation_ids: donationIds }
        );

      return data;
    },
    mutationKey: donationEntryKeys.printAddress(donationIds),
    ...options,
  });
}
