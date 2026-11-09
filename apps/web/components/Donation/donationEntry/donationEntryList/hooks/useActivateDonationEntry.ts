import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiErrorResponse } from "@web/types/apiResponse";

export type ActivateDonationEntryPayload = {
  donation_id: string;
  is_active: boolean;
};

type UseActivateDonationEntryArgs = {
  options?: UseMutationOptions<
    DonationEntryApiSuccessResponse,
    ApiErrorResponse<ActivateDonationEntryPayload>,
    ActivateDonationEntryPayload
  >;
};

export function useActivateDonationEntry({
  options = {},
}: UseActivateDonationEntryArgs = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({
      donation_id,
      is_active,
    }: ActivateDonationEntryPayload) => {
      const { data } =
        await axiosPrivate.patch<DonationEntryApiSuccessResponse>(
          DONATION_ROUTES.patch(donation_id),
          {
            is_active,
          }
        );

      return data;
    },
    mutationKey: donationEntryKeys.activateDonationEntry(),
    ...options,
  });
}
