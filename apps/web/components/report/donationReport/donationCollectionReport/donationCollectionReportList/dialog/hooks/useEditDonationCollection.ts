import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CurrencyFormFieldValues } from "@web/components/report/CurrencyDetailFrom";
import { DONATION_COLLECTION_REPORT_ROUTES } from "@web/constants/routes/donation_collection_report/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { donationCollectionKeys } from "@web/queryKeysFactories/donationCollectionKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditDonationCollectionArgs = {
  dailyDonationId: string;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<CurrencyFormFieldValues>,
    Partial<CurrencyFormFieldValues>
  >;
};

export function useEditDonationCollection({
  dailyDonationId,
  options = {},
}: UseEditDonationCollectionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        DONATION_COLLECTION_REPORT_ROUTES.patch(dailyDonationId),
        formValues
      );

      return data;
    },
    mutationKey: donationCollectionKeys.edit(dailyDonationId),
    ...options,
  });
}
