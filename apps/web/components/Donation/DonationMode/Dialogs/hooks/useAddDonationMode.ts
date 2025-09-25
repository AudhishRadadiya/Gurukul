import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationModeFormFieldValues } from "@web/components/Donation/DonationMode/Dialogs/DonationModeForm";
import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddDonationModeArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<DonationModeFormFieldValues>,
    Partial<DonationModeFormFieldValues>
  >;
};

export function useAddDonationMode({ options = {} }: UseAddDonationModeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        DONATION_MODE_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: donationModeKeys.add(),
    ...options,
  });
}
