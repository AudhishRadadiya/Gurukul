import { useQuery } from "@tanstack/react-query";

import { SMS_TEMPLATE_ROUTES } from "@web/constants/routes/sms_template/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsTemplateKeys } from "@web/queryKeysFactories/smsTemplateKeys";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type SmsTemplateDetail = {
  donation_amount: string;
  full_count: string;
  is_active: boolean;
  is_deleted: boolean;
  sms_template_id: string;
  template_name: string;
  template_parameter: string;
  template_parameter_text: string;
  template_type: number;
};

export type GetSmsTemplateSuccessResponse = ApiSuccessResponse<{
  smsTemplateDetail: SmsTemplateDetail[];
  totalCount: number;
}>;

export function useGetSmsTemplate(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getSmsTemplate = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetSmsTemplateSuccessResponse>(
      SMS_TEMPLATE_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { smsTemplateDetail: [], totalCount: 0 },
    queryFn: () => getSmsTemplate(body),
    queryKey: smsTemplateKeys.listing(body),
  });
}
