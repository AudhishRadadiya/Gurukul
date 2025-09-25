import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { CurrencyFormFieldValues } from "@web/components/report/CurrencyDetailFrom";
import { DAILY_COLLECTION_ROUTES } from "@web/constants/routes/daily_collection/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dailyCollectionKeys } from "@web/queryKeysFactories/dailyCollectionKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddDonationCollectionArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<CurrencyFormFieldValues>,
    Partial<CurrencyFormFieldValues>
  >;
};

export function useAddDonationCollection({
  options = {},
}: UseAddDonationCollectionArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        DAILY_COLLECTION_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: dailyCollectionKeys.post(),
    ...options,
  });
}
