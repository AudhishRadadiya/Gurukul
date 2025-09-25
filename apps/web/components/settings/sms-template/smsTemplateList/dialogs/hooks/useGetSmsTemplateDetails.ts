import { useQuery } from "@tanstack/react-query";

import type { SmsTemplateFormFieldValues } from "@web/components/settings/sms-template/dialogs/SmsTemplateForm";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { SMS_TEMPLATE_ROUTES } from "@web/constants/routes/sms_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetSmsTemplateDetailsArgs = {
  smsTemplateId: SmsTemplateDetail["sms_template_id"];
};

export function useGetSmsTemplateDetails({
  smsTemplateId,
}: UseGetSmsTemplateDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSmsTemplateDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SmsTemplateFormFieldValues>>(
      SMS_TEMPLATE_ROUTES.get(smsTemplateId)
    );

    return data;
  };

  return useQuery({
    enabled: !!smsTemplateId,
    queryFn: fetchSmsTemplateDetails,
    queryKey: smsTemplateKeys.get(smsTemplateId),
  });
}
