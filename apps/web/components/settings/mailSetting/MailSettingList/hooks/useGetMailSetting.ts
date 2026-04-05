import { useQuery } from "@tanstack/react-query";

import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type MailSettingDetail = {
  email_setting_id: string;
  full_count: string;
  is_active: boolean;
  sender_email: string;
  smtp_enable: boolean;
  smtp_server: string;
};

export type getMailSettingSuccessResponse = ApiSuccessResponse<{
  mailSettingDetail: MailSettingDetail[];
  totalCount: number;
}>;

export function useGetMailSetting(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getMailSetting = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<getMailSettingSuccessResponse>(
      EMAIL_SETTING_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { mailSettingDetail: [], totalCount: 0 },
    queryFn: () => getMailSetting(body),
    queryKey: mailSettingKeys.listing(body),
  });
}
