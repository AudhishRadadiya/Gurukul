import { useQuery } from "@tanstack/react-query";
import _first from "lodash/first";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";

import { EVENT_DROPDOWN_SUMMARY_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventDropdownSummaryKeys } from "@web/queryKeysFactories/eventDropdownSummary";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type EventDropdownReport = {
  dropdown_name: string;
  full_count: string;
  total_amount: number;
  total_receipt: string;
};

export function useGetEventDropdownSummary(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getEventDropdownSummary = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        eventDropdownReport: EventDropdownReport[];
        full_count: number;
        totalAmount: number;
      }>
    >(EVENT_DROPDOWN_SUMMARY_ROUTES.listing, body);

    return data.data;
  };

  const eventId = body.externalFilter?.event_id;

  const eventDropdownId = body.externalFilter?.event_dropdown_id;

  const branchId = body.externalFilter?.branch_id;

  const hasBranchId =
    _isArray(branchId) && !_isEmpty(branchId) && !!_first(branchId);

  const isEnabled = Boolean(eventId && eventDropdownId && hasBranchId);

  return useQuery({
    enabled: isEnabled,
    initialData: {
      eventDropdownReport: [],
      full_count: 0,
      totalAmount: 0,
    },
    queryFn: () => getEventDropdownSummary(body),
    queryKey: eventDropdownSummaryKeys.listing(body),
  });
}
