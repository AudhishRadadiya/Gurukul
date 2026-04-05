import { useQuery } from "@tanstack/react-query";

import { EVENT_MASTER_ROUTES } from "@web/constants/routes/event_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type FilterEventOptionsType = {
  label: string;
  need_reminder: boolean;
  send_sms: boolean;
  value: string;
};

type UseGetFilterEventOptionsProps = {
  isUserWise?: boolean;
};

export function useGetFilterEventOptions({
  isUserWise = false,
}: UseGetFilterEventOptionsProps = {}) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventOption = async () => {
    const url = isUserWise
      ? EVENT_MASTER_ROUTES.filterOptionsUserWise
      : EVENT_MASTER_ROUTES.filterOptions;

    const { data } =
      await axiosPrivate.get<ApiSuccessResponse<FilterEventOptionsType[]>>(url);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchEventOption,
    queryKey: eventKeys.filterOptions(isUserWise),
  });
}
