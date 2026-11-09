import { useQuery } from "@tanstack/react-query";

import { EVENT_CONTACT_DETAIL_ROUTES } from "@web/constants/routes/event_contact_detail/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventContactDetailKeys } from "@web/queryKeysFactories/eventContactDetail";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetEventContactDetailNameOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchEventContactDetailNameOptions = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      EVENT_CONTACT_DETAIL_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchEventContactDetailNameOptions,
    queryKey: eventContactDetailKeys.options(),
  });
}
