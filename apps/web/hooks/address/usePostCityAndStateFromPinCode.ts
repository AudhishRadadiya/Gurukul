import { useQuery } from "@tanstack/react-query";

import { LOCATION_ROUTES } from "@web/constants/routes/location/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { locationKeys } from "@web/queryKeysFactories/location";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type LocationResponse = {
  city: string;
  state: string;
};

type UsePostCityAndStateFromPinCodeProps = {
  pinCode: string;
};

export function usePostCityAndStateFromPinCode({
  pinCode,
}: UsePostCityAndStateFromPinCodeProps) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchLocation = async () => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<LocationResponse>
    >(LOCATION_ROUTES.getLocation, {
      pincode: pinCode,
    });

    return data.data;
  };

  return useQuery({
    enabled: !!pinCode,
    queryFn: fetchLocation,
    queryKey: locationKeys.getLocation(pinCode),
  });
}
