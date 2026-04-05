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

type UseGetEventOptionsProps = {
  isUserWise?: boolean;
};

export function useGetEventOptions({
  isUserWise = false,
}: UseGetEventOptionsProps = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventOption = async () => {
    const url = isUserWise
      ? EVENT_MASTER_ROUTES.optionsUserWise
      : EVENT_MASTER_ROUTES.options;

    const { data } =
      await axiosPrivate.get<ApiSuccessResponse<EventOptionsType[]>>(url);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchEventOption,
    queryKey: eventKeys.options(isUserWise),
  });
}
