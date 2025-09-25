import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { SMS_TEMPLATE_ROUTES } from "@web/constants/routes/sms_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteSmsTemplateArgs = {
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
  smsTemplateId: SmsTemplateDetail["sms_template_id"];
};

export function useDeleteSmsTemplate({
  options = {},
  smsTemplateId,
}: UseDeleteSmsTemplateArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        SMS_TEMPLATE_ROUTES.delete(smsTemplateId)
      );

      return data;
    },
    mutationKey: smsTemplateKeys.delete(smsTemplateId),
    ...options,
  });
}
