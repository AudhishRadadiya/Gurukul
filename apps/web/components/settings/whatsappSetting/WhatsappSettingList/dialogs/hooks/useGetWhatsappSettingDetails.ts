import { useQuery } from "@tanstack/react-query";

import type { WhatsappSettingFormFieldValues } from "@web/components/settings/whatsappSetting/dialogs/WhatsappSettingForm";
import type { WhatsappSettingDetail } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import { WHATSAPP_SETTING_ROUTES } from "@web/constants/routes/whatsapp_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { whatsappSettingKeys } from "@web/queryKeysFactories/whatsappSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetWhatsappSettingDetailsArgs = {
  whatsappSettingId: WhatsappSettingDetail["whatsapp_setting_id"];
};

export function useGetWhatsappSettingDetails({
  whatsappSettingId,
}: UseGetWhatsappSettingDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchWhatsappSettingDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<
      ApiSuccessResponse<WhatsappSettingFormFieldValues>
    >(WHATSAPP_SETTING_ROUTES.get(whatsappSettingId));

    return data;
  };

  return useQuery({
    queryFn: fetchWhatsappSettingDetails,
    queryKey: whatsappSettingKeys.get(whatsappSettingId),
  });
}
