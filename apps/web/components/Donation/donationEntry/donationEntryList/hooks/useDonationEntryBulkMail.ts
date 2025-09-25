import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { BulkMailFormFieldValues } from "@web/components/Donation/donationEntry/dialogs/bulkMail/BulkMailForm";
import { DONATION_ROUTES } from "@web/constants/routes/donation/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationEntryKeys } from "@web/queryKeysFactories/donationEntry";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDonationEntryBulkMailArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<BulkMailFormFieldValues>,
    Partial<
      BulkMailFormFieldValues & {
        donation_id: string[];
      }
    >
  >;
};

export function useDonationEntryBulkMail({
  options = {},
}: UseDonationEntryBulkMailArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        DONATION_ROUTES.sendBulkMail,
        formValues
      );

      return data;
    },
    mutationKey: donationEntryKeys.sendBulkMail(),
    ...options,
  });
}
