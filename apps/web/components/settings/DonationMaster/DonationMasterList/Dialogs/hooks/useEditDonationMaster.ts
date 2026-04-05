import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationMasterFormFieldValues } from "@web/components/settings/DonationMaster/Dialogs/DonationMasterForm";
import type { DonationMaster } from "@web/components/settings/DonationMaster/DonationMasterList/hooks/useGetDonationMaster";
import { DONATION_MASTER_ROUTES } from "@web/constants/routes/donation_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationMasterKeys } from "@web/queryKeysFactories/donationMaster";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type EditDonationMasterApiResponse = ApiSuccessResponse<DonationMaster>;

type UseEditDonationMasterArgs = {
  donationMasterId: string;
  options: UseMutationOptions<
    EditDonationMasterApiResponse,
    ApiErrorResponse<DonationMasterFormFieldValues>,
    Partial<DonationMasterFormFieldValues>
  >;
};

export function useEditDonationMaster({
  donationMasterId,
  options = {},
}: UseEditDonationMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditDonationMasterApiResponse>(
        DONATION_MASTER_ROUTES.patch(donationMasterId),
        formValues
      );

      return data;
    },
    mutationKey: donationMasterKeys.edit(donationMasterId),
    ...options,
  });
}
