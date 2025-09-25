import { useQuery } from "@tanstack/react-query";

import type { EventDonationEntry } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntry";
import { EVENT_DONATION_ENTRY_ROUTES } from "@web/constants/routes/event_donation_entry/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetEventDonationEntryDetailsArgs = {
  eventDonationId: EventDonationEntry["event_donation_id"];
};

export function useGetEventDonationEntryDetails({
  eventDonationId,
}: UseGetEventDonationEntryDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventDonationEntryDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<EventDonationEntry>>(
      EVENT_DONATION_ENTRY_ROUTES.get(eventDonationId)
    );

    return data;
  };

  return useQuery({
    enabled: !!eventDonationId,
    queryFn: fetchEventDonationEntryDetails,
    queryKey: eventDonationEntryKeys.get(eventDonationId),
  });
}
