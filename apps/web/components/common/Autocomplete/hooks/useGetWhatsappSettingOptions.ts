import { useQuery } from "@tanstack/react-query";

import { WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

export function useGetWhatsappSettingOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWhatsappSettingOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<OptionsType[]>>(
      WHATSAPP_SETTING_ROUTES.options
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchWhatsappSettingOption,
    queryKey: whatsappSettingKeys.options(),
  });
}
