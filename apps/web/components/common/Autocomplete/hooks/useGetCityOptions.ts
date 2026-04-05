import { useQuery } from "@tanstack/react-query";

import { LOCATION_ROUTES } from "@web/constants/routes/location/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { locationKeys } from "@web/queryKeysFactories/location";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetCityOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchCityOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      LOCATION_ROUTES.cityOptions
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchCityOption,
    queryKey: locationKeys.cityOptions(),
  });
}
