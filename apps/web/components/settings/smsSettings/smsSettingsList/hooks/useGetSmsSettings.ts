import { useQuery } from "@tanstack/react-query";

import { SMS_SETTING_ROUTES } from "@web/constants/routes/sms_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsSettingKeys } from "@web/queryKeysFactories/smsSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type SmsSettingDetail = {
  full_count: string;
  is_active: boolean;
  sms_auth_key: string;
  sms_password: string;
  sms_sender_id: string;
  sms_setting_id: string;
  sms_template: string;
  sms_url: string;
  sms_username: string;
};

export type GetSmsSettingsSuccessResponse = ApiSuccessResponse<{
  smsSettingDetail: SmsSettingDetail[];
  totalCount: number;
}>;

export function useGetSmsSettings(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getSmsSettings = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetSmsSettingsSuccessResponse>(
      SMS_SETTING_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { smsSettingDetail: [], totalCount: 0 },
    queryFn: () => getSmsSettings(body),
    queryKey: smsSettingKeys.listing(body),
  });
}
