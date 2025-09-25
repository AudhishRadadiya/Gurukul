import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationEntryFormNonNullFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import type { DonationEntryApiSuccessResponse } from "@web/components/Donation/donationEntry/addDonationEntry/hooks/useAddDonationEntry";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiErrorResponse } from "@web/types/apiResponse";

type UseEditDonationEntryArgs = {
  donationId: string;
  options: UseMutationOptions<
    DonationEntryApiSuccessResponse,
    ApiErrorResponse<DonationEntryFormNonNullFieldValues>,
    Partial<DonationEntryFormNonNullFieldValues>
  >;
};

export function useEditDonationEntry({
  donationId,
  options = {},
}: UseEditDonationEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<DonationEntryApiSuccessResponse>(
          DONATION_ROUTES.patch(donationId),
          formValues
        );

      return data;
    },
    mutationKey: donationEntryKeys.edit(donationId),
    ...options,
  });
}
