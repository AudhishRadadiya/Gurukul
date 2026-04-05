import { useQuery } from "@tanstack/react-query";

import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetMailSettingOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMailSettingOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      EMAIL_SETTING_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchMailSettingOption,
    queryKey: mailSettingKeys.options(),
  });
}
