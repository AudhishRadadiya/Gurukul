import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiErrorResponse } from "@web/types/apiResponse";

type CancelDonationEntryFormValues = Partial<DonationEntryFormFieldValues> & {
  donation_id: string;
  is_cancel: true;
};

type UseCancelDonationEntryArgs = {
  options: UseMutationOptions<
    DonationEntryApiSuccessResponse,
    ApiErrorResponse<DonationEntryFormFieldValues>,
    CancelDonationEntryFormValues
  >;
};

export function useCancelDonationEntry({
  options = {},
}: UseCancelDonationEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async ({ donation_id, ...formValues }) => {
      const { data } =
        await axiosPrivate.patch<DonationEntryApiSuccessResponse>(
          DONATION_ROUTES.cancelDonationEntry(donation_id),
          formValues
        );

      return data;
    },
    mutationKey: donationEntryKeys.cancelDonationEntry(),
    ...options,
  });
}
