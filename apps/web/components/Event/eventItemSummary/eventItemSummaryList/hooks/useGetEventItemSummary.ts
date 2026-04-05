import { useQuery } from "@tanstack/react-query";

import { EVENT_ITEMS_SUMMARY_ROUTES } from "@web/constants/routes/event_master/event_items/summary/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventItemSummaryKeys } from "@web/queryKeysFactories/eventSummary";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";
import { isBranchFilterEnabled } from "@web/utils/reactQuery";

export type EventItem = {
  amount: number;
  event_item_id: string;
  qty: number;
  title: string;
  total_amount: number;
  type: 0;
  value: string;
};

export type EventItemSummary = {
  event_items: EventItem[];
  event_name: string;
  full_count: string;
  total: number;
};

export type GetEventItemSummarySuccessResponse = ApiSuccessResponse<{
  eventItemSummary: EventItemSummary[];
  totalCount: number;
}>;

export function useGetEventItemSummary(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventItemSummary = async (body: GetListArgsAg2) => {
    const { data } =
      await axiosPrivate.post<GetEventItemSummarySuccessResponse>(
        EVENT_ITEMS_SUMMARY_ROUTES.listing,
        body
      );

    return data.data;
  };

  return useQuery({
    enabled: isBranchFilterEnabled(body) && !!body.externalFilter?.event_id,
    initialData: { eventItemSummary: [], totalCount: 0 },
    queryFn: () => getEventItemSummary(body),
    queryKey: eventItemSummaryKeys.listing(body),
  });
}
