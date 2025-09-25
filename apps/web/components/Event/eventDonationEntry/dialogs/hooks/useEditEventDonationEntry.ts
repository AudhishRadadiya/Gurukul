import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { EventDonationEntryFormFieldValues } from "@web/components/Event/eventDonationEntry/dialogs/EventDonationEntryForm";
import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditEventDonationEntryArgs = {
  eventDonationId: string;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<EventDonationEntryFormFieldValues>,
    Partial<EventDonationEntryFormFieldValues>
  >;
};

export function useEditEventDonationEntry({
  eventDonationId,
  options = {},
}: UseEditEventDonationEntryArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        EVENT_DONATION_ENTRY_ROUTES.patch(eventDonationId),
        formValues
      );

      return data;
    },
    mutationKey: eventDonationEntryKeys.edit(eventDonationId),
    ...options,
  });
}
