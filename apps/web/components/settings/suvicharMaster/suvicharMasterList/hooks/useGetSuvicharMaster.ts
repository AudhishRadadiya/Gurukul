import { useQuery } from "@tanstack/react-query";

import { SUVICHAR_MASTER_ROUTES } from "@web/constants/routes/suvichar_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type SuvicharDetails = {
  full_count: string;
  is_deleted: boolean;
  is_sms: boolean;
  is_whatsapp: boolean;
  suvichar: string;
  suvichar_id: string;
};

export type GetSuvicharMasterSuccessResponse = ApiSuccessResponse<{
  suvicharDetails: SuvicharDetails[];
  totalCount: number;
}>;

export function useGetSuvicharMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getSuvicharMaster = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<GetSuvicharMasterSuccessResponse>(
      SUVICHAR_MASTER_ROUTES.listing,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: { suvicharDetails: [], totalCount: 0 },
    queryFn: () => getSuvicharMaster(body),
    queryKey: suvicharMasterKeys.listing(body),
  });
}
