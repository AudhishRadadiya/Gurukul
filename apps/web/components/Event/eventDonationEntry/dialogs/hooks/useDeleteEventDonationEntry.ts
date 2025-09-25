import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteEventDonationEntryArgs = {
  eventDonationId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteEventDonationEntry({
  eventDonationId,
  options = {},
}: UseDeleteEventDonationEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        EVENT_DONATION_ENTRY_ROUTES.delete(eventDonationId)
      );

      return data;
    },
    mutationKey: eventDonationEntryKeys.delete(eventDonationId),
    ...options,
  });
}
