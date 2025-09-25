import { useQuery } from "@tanstack/react-query";

import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type EmailSetting = {
  branch_id: string;
  content: string;
  email_setting_id: string;
  password: string;
  port_no: number;
  sender_email: string;
  smtp_enable: boolean;
  smtp_server: string;
};

export function useGetMailSettingDetails() {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMailSettingDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<EmailSetting>>(
      EMAIL_SETTING_ROUTES.get()
    );

    return data;
  };

  return useQuery({
    queryFn: fetchMailSettingDetails,
    queryKey: mailSettingKeys.get(),
  });
}
