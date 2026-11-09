import { useQuery } from "@tanstack/react-query";

import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type MetaWhatsappSettingDetailsForTemplate = {
  meta_whatsapp_setting_id: string;
  phone_number_id: string;
  title: string;
};

type UseGetMetaWhatsappSettingDetailsForTemplateArgs = {
  metaWhatsappSettingId?: string | null;
};

export function useGetMetaWhatsappSettingDetailsForTemplate({
  metaWhatsappSettingId,
}: UseGetMetaWhatsappSettingDetailsForTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<MetaWhatsappSettingDetailsForTemplate>
    >(META_WHATSAPP_SETTING_ROUTES.get(metaWhatsappSettingId ?? ""));

    return data;
  };

  return useQuery({
    enabled: !!metaWhatsappSettingId,
    queryFn: fetchDetails,
    queryKey: metaWhatsappSettingKeys.get(metaWhatsappSettingId ?? ""),
  });
}
