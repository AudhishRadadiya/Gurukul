import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteSMSMasterApiResponse = ApiSuccessResponse<SMSMaster>;

type UseDeleteSMSMasterArgs = {
  options: UseMutationOptions<DeleteSMSMasterApiResponse, ApiErrorResponse>;
  smsMasterId: string;
};

export function useDeleteSMSMaster({
  options = {},
  smsMasterId,
}: UseDeleteSMSMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteSMSMasterApiResponse>(
        SMS_MASTER_ROUTES.delete(smsMasterId)
      );

      return data;
    },
    mutationKey: smsMasterKeys.delete(smsMasterId),
    ...options,
  });
}
