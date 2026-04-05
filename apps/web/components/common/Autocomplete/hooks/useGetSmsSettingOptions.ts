import { useQuery } from "@tanstack/react-query";

import { SMS_SETTING_ROUTES } from "@web/constants/routes/sms_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetSmsSettingOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSmsSettingOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      SMS_SETTING_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchSmsSettingOption,
    queryKey: smsSettingKeys.options(),
  });
}
