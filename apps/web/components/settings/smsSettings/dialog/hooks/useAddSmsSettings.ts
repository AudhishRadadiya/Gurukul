import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SmsSettingsFormFieldValues } from "@web/components/settings/smsSettings/dialog/SmsSettingsForm";
import { SMS_SETTING_ROUTES } from "@web/constants/routes/sms_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddSmsSettingsArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SmsSettingsFormFieldValues>,
    Partial<SmsSettingsFormFieldValues>
  >;
};

export function useAddSmsSettings({ options = {} }: UseAddSmsSettingsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        SMS_SETTING_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: smsSettingKeys.add(),
    ...options,
  });
}
