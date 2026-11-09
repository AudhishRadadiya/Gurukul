import { useQuery } from "@tanstack/react-query";

import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";
import type {
  EventMasterDetail,
  LinksType,
} from "@web/components/settings/event-master/EventMasterList/hooks/useGetActiveEventMaster";
import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetEventMasterDetailsArgs = {
  eventMasterId: EventMasterDetail["event_master_id"];
};

type GetEventMasterDetailsResponse = EventMasterFormFieldValues & {
  links: LinksType[];
};

export function useGetEventMasterDetails({
  eventMasterId,
}: UseGetEventMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<GetEventMasterDetailsResponse>
    >(EVENT_MASTER_ROUTES.get(eventMasterId));

    return data;
  };

  return useQuery({
    enabled: !!eventMasterId,
    queryFn: fetchEventMasterDetails,
    queryKey: eventKeys.get(eventMasterId),
  });
}
