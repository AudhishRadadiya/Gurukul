import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationMasterFormFieldValues } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddDonationMasterArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<DonationMasterFormFieldValues>,
    Partial<DonationMasterFormFieldValues>
  >;
};

export function useAddDonationMaster({
  options = {},
}: UseAddDonationMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        DONATION_MASTER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: donationMasterKeys.add(),
    ...options,
  });
}
