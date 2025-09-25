import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteDonationMasterArgs = {
  donationMasterId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteDonationMaster({
  donationMasterId,
  options = {},
}: UseDeleteDonationMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        DONATION_MASTER_ROUTES.delete(donationMasterId)
      );

      return data;
    },
    mutationKey: donationMasterKeys.delete(donationMasterId),
    ...options,
  });
}
