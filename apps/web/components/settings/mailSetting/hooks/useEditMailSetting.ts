import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { MailSettingFormFieldValues } from "@web/components/settings/mailSetting/MailSettingForm";
import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditMailSettingArgs = {
  emailSettingId: string;
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<MailSettingFormFieldValues>,
    Partial<MailSettingFormFieldValues>
  >;
};

export function useEditMailSetting({
  emailSettingId,
  options = {},
}: UseEditMailSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        EMAIL_SETTING_ROUTES.patch(emailSettingId),
        formValues
      );

      return data;
    },
    mutationKey: mailSettingKeys.edit(emailSettingId),
    ...options,
  });
}
