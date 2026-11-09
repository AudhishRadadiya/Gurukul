import { useQuery } from "@tanstack/react-query";

import { META_WHATSAPP_TEMPLATE_ROUTES } from "@web/constants/routes/meta_whatsapp_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappTemplateKeys } from "@web/queryKeysFactories/metaWhatsappTemplate";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

type UseFetchMetaWhatsappTemplateOptionsArgs = {
  metaWhatsappSettingId: string | null;
};

export function useFetchMetaWhatsappTemplateOptions({
  metaWhatsappSettingId,
}: UseFetchMetaWhatsappTemplateOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTemplateOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      META_WHATSAPP_TEMPLATE_ROUTES.fetchList,
      {
        meta_whatsapp_setting_id: metaWhatsappSettingId,
      }
    );

    return data.data;
  };

  return useQuery({
    enabled: !!metaWhatsappSettingId,
    initialData: [],
    queryFn: fetchTemplateOptions,
    queryKey: metaWhatsappTemplateKeys.fetchList(metaWhatsappSettingId),
  });
}
