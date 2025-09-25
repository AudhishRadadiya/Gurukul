import { useQuery } from "@tanstack/react-query";

import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetSmsMasterOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSmsMasterOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SMS_MASTER_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchSmsMasterOption,
    queryKey: smsMasterKeys.options(),
  });
}
