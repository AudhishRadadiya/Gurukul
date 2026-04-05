import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationModeFormFieldValues } from "@web/components/settings/DonationMode/Dialogs/DonationModeForm";
import type { DonationMode } from "@web/components/settings/DonationMode/DonationModeList/hooks/useGetDonationMode";
import { DONATION_MODE_ROUTES } from "@web/constants/routes/donation_mode/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationModeKeys } from "@web/queryKeysFactories/donationMode";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type EditDonationModeApiResponse = ApiSuccessResponse<DonationMode>;

type UseEditDonationModeArgs = {
  donationModeId: string;
  options: UseMutationOptions<
    EditDonationModeApiResponse,
    ApiErrorResponse<DonationModeFormFieldValues>,
    Partial<DonationModeFormFieldValues>
  >;
};

export function useEditDonationMode({
  donationModeId,
  options = {},
}: UseEditDonationModeArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDonationModeApiResponse>(
        DONATION_MODE_ROUTES.patch(donationModeId),
        formValues
      );

      return data;
    },
    mutationKey: donationModeKeys.edit(donationModeId),
    ...options,
  });
}
