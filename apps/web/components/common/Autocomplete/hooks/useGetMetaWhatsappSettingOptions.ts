import { useQuery } from "@tanstack/react-query";

import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { StringValueOptionsType } from "@web/types/options";

export function useGetMetaWhatsappSettingOptions() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMetaWhatsappSettingOptions = async () => {
    const { data } = await axiosPrivate.get<
      ApiSuccessResponse<StringValueOptionsType[]>
    >(META_WHATSAPP_SETTING_ROUTES.options);

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchMetaWhatsappSettingOptions,
    queryKey: metaWhatsappSettingKeys.options(),
  });
}

