import { useQuery } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type EventOptionsType = {
  label: string;
  need_reminder: boolean;
  send_sms: boolean;
  value: string;
};

export function useGetEventOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventOption = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<EventOptionsType[]>
    >(EVENT_MASTER_ROUTES.options);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchEventOption,
    queryKey: eventKeys.options(),
  });
}
