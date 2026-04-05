import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MailSettingFormFieldValues } from "@web/components/settings/mailSetting/dialogs/MailSettingForm";
import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddMailSettingArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse,
    Partial<MailSettingFormFieldValues>
  >;
};

export function useAddMailSetting({ options = {} }: UseAddMailSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        EMAIL_SETTING_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: mailSettingKeys.add(),
    ...options,
  });
}
