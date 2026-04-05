import { useQuery } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type EventDropdownOptionsType = {
  label: string;
  value: string;
};

type UseGetEventDropdownOptionsProps = {
  eventMasterId: string;
};

export function useGetEventDropdownOptions({
  eventMasterId,
}: UseGetEventDropdownOptionsProps) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventDropdownOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EventDropdownOptionsType[]>
    >(EVENT_MASTER_ROUTES.eventDropdownOptions(eventMasterId));

    return data.data;
  };

  return useQuery({
    enabled: !!eventMasterId,
    initialData: [],
    queryFn: fetchEventDropdownOption,
    queryKey: eventKeys.eventDropdownOptions(eventMasterId),
  });
}
