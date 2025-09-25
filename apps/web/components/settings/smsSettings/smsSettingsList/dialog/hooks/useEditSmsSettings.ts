import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SmsSettingsFormFieldValues } from "@web/components/settings/smsSettings/dialog/SmsSettingsForm";
import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { SMS_SETTING_ROUTES } from "@web/constants/routes/sms_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditSmsSettingsArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SmsSettingsFormFieldValues>,
    Partial<SmsSettingsFormFieldValues>
  >;
  smsSettingId: SmsSettingDetail["sms_setting_id"];
};

export function useEditSmsSettings({
  options = {},
  smsSettingId,
}: UseEditSmsSettingsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        SMS_SETTING_ROUTES.patch(smsSettingId),
        formValues
      );

      return data;
    },
    mutationKey: smsSettingKeys.edit(smsSettingId),
    ...options,
  });
}
