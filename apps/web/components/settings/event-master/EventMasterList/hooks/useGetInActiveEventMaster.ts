import { useQuery } from "@tanstack/react-query";

import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export function useGetInActiveEventMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getInActiveEvent = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        eventMasterDetail: EventMasterDetail[];
        totalCount: number;
      }>
    >(EVENT_MASTER_ROUTES.inActiveListing, body);

    return data.data;
  };

  return useQuery({
    initialData: { eventMasterDetail: [], totalCount: 0 },
    queryFn: () => getInActiveEvent(body),
    queryKey: eventKeys.inActiveListing(body),
  });
}
