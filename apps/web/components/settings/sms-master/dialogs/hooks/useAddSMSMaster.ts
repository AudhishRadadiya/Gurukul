import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SMSMasterFormFieldValues } from "@web/components/settings/sms-master/dialogs/SMSMasterForm";
import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type { ApiErrorResponse } from "@web/types/apiResponse";
import type { EmptyApiSuccessResponse } from "@web/types/shared-types";

type UseAddSMSMasterArgs = {
  options: UseMutationOptions<
    EmptyApiSuccessResponse,
    ApiErrorResponse<SMSMasterFormFieldValues>,
    Partial<SMSMasterFormFieldValues>
  >;
};

export function useAddSMSMaster({ options = {} }: UseAddSMSMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<EmptyApiSuccessResponse>(
        SMS_MASTER_ROUTES.post,
        formValues
      );

      return data;
    },
    mutationKey: smsMasterKeys.add(),
    ...options,
  });
}
