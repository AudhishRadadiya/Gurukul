import { useQuery } from "@tanstack/react-query";

import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetSMSMasterDetailsArgs = {
  smsMasterId: SMSMaster["sms_master_id"];
};

export function useGetSMSMasterDetails({
  smsMasterId,
}: UseGetSMSMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSMSMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SMSMaster>>(
      SMS_MASTER_ROUTES.get(smsMasterId)
    );

    return data;
  };

  return useQuery({
    enabled: !!smsMasterId,
    queryFn: fetchSMSMasterDetails,
    queryKey: smsMasterKeys.get(smsMasterId),
  });
}
