import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@web/types/apiResponse";

type GetDonationLetterPayload = {
  letterUrl: string;
};

type GetDonationLetterArgs = {
  donation_id: string;
};

export type GetDonationLetterApiSuccessResponse =
  ApiSuccessResponse<GetDonationLetterPayload>;

type UseGetDonationLetterArgs = {
  options: UseMutationOptions<
    GetDonationLetterApiSuccessResponse,
    ApiErrorResponse<GetDonationLetterPayload>,
    GetDonationLetterArgs
  >;
};

export function useGetDonationLetter({
  options = {},
}: UseGetDonationLetterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ donation_id }) => {
      const { data } =
        await axiosPrivate.post<GetDonationLetterApiSuccessResponse>(
          DONATION_ROUTES.donationLetter,
          { donation_id }
        );

      return data;
    },
    mutationKey: donationEntryKeys.donationLetter(),
    ...options,
  });
}
