import { useQuery } from "@tanstack/react-query";

import type { MailSettingFormFieldValues } from "@web/components/settings/mailSetting/dialogs/MailSettingForm";
import type { MailSettingDetail } from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { mailSettingKeys } from "@web/queryKeysFactories/mailSetting";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetMailSettingDetailsArgs = {
  emailSettingId: MailSettingDetail["email_setting_id"];
};

export function useGetMailSettingDetails({
  emailSettingId,
}: UseGetMailSettingDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchMailSettingDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<MailSettingFormFieldValues>>(
      EMAIL_SETTING_ROUTES.get(emailSettingId)
    );

    return data;
  };

  return useQuery({
    queryFn: fetchMailSettingDetails,
    queryKey: mailSettingKeys.get(emailSettingId),
  });
}
