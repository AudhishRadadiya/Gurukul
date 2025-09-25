import { useQuery } from "@tanstack/react-query";

import type { SmsSettingsFormFieldValues } from "@web/components/settings/smsSettings/dialog/SmsSettingsForm";
import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { SMS_SETTING_ROUTES } from "@web/constants/routes/sms_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetSmsSettingsDetailsArgs = {
  smsSettingId: SmsSettingDetail["sms_setting_id"];
};

export function useGetSmsSettingsDetails({
  smsSettingId,
}: UseGetSmsSettingsDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSmsSettingsDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SmsSettingsFormFieldValues>>(
      SMS_SETTING_ROUTES.get(smsSettingId)
    );

    return data;
  };

  return useQuery({
    enabled: !!smsSettingId,
    queryFn: fetchSmsSettingsDetails,
    queryKey: smsSettingKeys.get(smsSettingId),
  });
}
