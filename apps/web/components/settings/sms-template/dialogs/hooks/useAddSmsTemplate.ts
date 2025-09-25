import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SmsTemplateFormFieldValues } from "@web/components/settings/sms-template/dialogs/SmsTemplateForm";
import { SMS_TEMPLATE_ROUTES } from "@web/constants/routes/sms_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddSmsTemplateArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SmsTemplateFormFieldValues>,
    Partial<SmsTemplateFormFieldValues>
  >;
};

export function useAddSmsTemplate({ options = {} }: UseAddSmsTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        SMS_TEMPLATE_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: smsTemplateKeys.add(),
    ...options,
  });
}
