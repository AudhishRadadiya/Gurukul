import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SMSMasterFormFieldValues } from "@web/components/settings/sms-master/dialogs/SMSMasterForm";
import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditSMSMasterApiResponse = ApiSuccessResponse<SMSMaster>;

type UseEditSMSMasterArgs = {
  options: UseMutationOptions<
    EditSMSMasterApiResponse,
    ApiErrorResponse<SMSMasterFormFieldValues>,
    Partial<SMSMasterFormFieldValues>
  >;
  smsMasterId: string;
};

export function useEditSMSMaster({
  options = {},
  smsMasterId,
}: UseEditSMSMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditSMSMasterApiResponse>(
        SMS_MASTER_ROUTES.patch(smsMasterId),
        formValues
      );

      return data;
    },
    mutationKey: smsMasterKeys.edit(smsMasterId),
    ...options,
  });
}
