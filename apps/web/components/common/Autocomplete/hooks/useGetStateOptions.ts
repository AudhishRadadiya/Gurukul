import { useQuery } from "@tanstack/react-query";

import { LOCATION_ROUTES } from "@web/constants/routes/location/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { locationKeys } from "@web/queryKeysFactories/location";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetStateOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchStateOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LOCATION_ROUTES.stateOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchStateOption,
    queryKey: locationKeys.stateOptions(),
  });
}
