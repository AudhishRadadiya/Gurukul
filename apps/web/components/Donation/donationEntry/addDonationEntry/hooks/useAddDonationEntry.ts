import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

export type DonationEntryApiSuccessResponse = ApiSuccessResponse<{
  donation_id: string;
  receipt: string;
}>;

type UseAddDonationEntryArgs = {
  options: UseMutationOptions<
    DonationEntryApiSuccessResponse,
    ApiErrorResponse,
    Partial<DonationEntryFormFieldValues>
  >;
};

export function useAddDonationEntry({ options = {} }: UseAddDonationEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<DonationEntryApiSuccessResponse>(
        DONATION_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: donationEntryKeys.add(),
    ...options,
  });
}
