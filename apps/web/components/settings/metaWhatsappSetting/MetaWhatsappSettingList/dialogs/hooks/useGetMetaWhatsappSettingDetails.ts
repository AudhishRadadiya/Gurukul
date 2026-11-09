import { useQuery } from "@tanstack/react-query";

import type { MetaWhatsappSettingFormFieldValues } from "@web/components/settings/metaWhatsappSetting/dialogs/MetaWhatsappSettingForm";
import { META_WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/meta_whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { metaWhatsappSettingKeys } from "@web/queryKeysFactories/metaWhatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetMetaWhatsappSettingDetailsArgs = {
  metaWhatsappSettingId: string;
};

export function useGetMetaWhatsappSettingDetails({
  metaWhatsappSettingId,
}: UseGetMetaWhatsappSettingDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMetaWhatsappSettingDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<MetaWhatsappSettingFormFieldValues>
    >(META_WHATSAPP_SETTING_ROUTES.get(metaWhatsappSettingId));

    return data;
  };

  return useQuery({
    queryFn: fetchMetaWhatsappSettingDetails,
    queryKey: metaWhatsappSettingKeys.get(metaWhatsappSettingId),
  });
}
