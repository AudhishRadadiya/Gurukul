import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SmsTemplateFormFieldValues } from "@web/components/settings/sms-template/dialogs/SmsTemplateForm";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { SMS_TEMPLATE_ROUTES } from "@web/constants/routes/sms_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseEditSmsTemplateArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SmsTemplateFormFieldValues>,
    Partial<SmsTemplateFormFieldValues>
  >;

  smsTemplateId: SmsTemplateDetail["sms_template_id"];
};

export function useEditSmsTemplate({
  options = {},
  smsTemplateId,
}: UseEditSmsTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EmptyApiSuccessResponse>(
        SMS_TEMPLATE_ROUTES.patch(smsTemplateId),
        formValues
      );

      return data;
    },
    mutationKey: smsTemplateKeys.edit(smsTemplateId),
    ...options,
  });
}
