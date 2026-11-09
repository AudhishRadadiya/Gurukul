import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import { EMAIL_SETTING_ROUTES } from "@web/constants/routes/email_setting/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { eventKeys } from "@web/queryKeysFactories/event";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseDeleteMailSettingArgs = {
  emailSettingId: string;
  options: UseMutationOptions<EmptyApiSuccessResponse, ApiErrorResponse>;
};

export function useDeleteMailSetting({
  emailSettingId,
  options = {},
}: UseDeleteMailSettingArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<EmptyApiSuccessResponse>(
        EMAIL_SETTING_ROUTES.delete(emailSettingId)
      );

      return data;
    },
    mutationKey: eventKeys.delete(emailSettingId),
    ...options,
  });
}
