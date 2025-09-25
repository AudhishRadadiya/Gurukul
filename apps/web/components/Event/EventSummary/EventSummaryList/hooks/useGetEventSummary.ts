import { useQuery } from "@tanstack/react-query";

import { EVENT_SUMMARY_ROUTES } from "@web/constants/routes/event_summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventSummaryKeys } from "@web/queryKeysFactories/eventSummary";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type EventSummary = {
  event_type: string;
  total_amount: number;
  total_receipt: number;
};

export type GetEventSummarySuccessResponse = ApiSuccessResponse<{
  eventSummaryData: EventSummary[];
  totalCount: number;
}>;

export function useGetEventSummary(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventSummary = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetEventSummarySuccessResponse>(
      EVENT_SUMMARY_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { eventSummaryData: [], totalCount: 0 },
    queryFn: () => getEventSummary(body),
    queryKey: eventSummaryKeys.listing(body),
  });
}
