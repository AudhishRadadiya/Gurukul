import { useQuery } from "@tanstack/react-query";

import type { SuvicharDetails } from "@web/components/Donation/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import { SUVICHAR_MASTER_ROUTES } from "@web/constants/routes/suvichar_master/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { suvicharMasterKeys } from "@web/queryKeysFactories/suvicharMaster";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetSuvicharMasterDetailsArgs = {
  suvicharId: SuvicharDetails["suvichar_id"];
};

export function useGetSuvicharMasterDetails({
  suvicharId,
}: UseGetSuvicharMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchSuvicharMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<SuvicharDetails>>(
      SUVICHAR_MASTER_ROUTES.get(suvicharId)
    );

    return data;
  };

  return useQuery({
    enabled: !!suvicharId,
    queryFn: fetchSuvicharMasterDetails,
    queryKey: suvicharMasterKeys.get(suvicharId),
  });
}
