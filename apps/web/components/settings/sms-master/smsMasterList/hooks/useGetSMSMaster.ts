import { useQuery } from "@tanstack/react-query";

import { SMS_MASTER_ROUTES } from "@web/constants/routes/sms_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { smsMasterKeys } from "@web/queryKeysFactories/smsMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type SMSMaster = {
  full_count: string;
  is_active: boolean;
  is_deleted: boolean;
  sms_master_id: string;
  sms_name: string;
};

export type GetSMSMasterSuccessResponse = ApiSuccessResponse<{
  smsMasterDetail: SMSMaster[];
  totalCount: number;
}>;

export function useGetSMSMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getSMSMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetSMSMasterSuccessResponse>(
      SMS_MASTER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      smsMasterDetail: [],
      totalCount: 0,
    },
    queryFn: () => getSMSMaster(body),
    queryKey: smsMasterKeys.listing(body),
  });
}
