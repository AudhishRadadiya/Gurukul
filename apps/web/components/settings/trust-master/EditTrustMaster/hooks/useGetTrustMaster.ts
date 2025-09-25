import { useQuery } from "@tanstack/react-query";

import type { TrustMasterFormFieldValues } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import type { Trust } from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetTrustMasterDetailsArgs = {
  trustMasterId: Trust["trust_id"];
};

export function useGetTrustMasterDetails({
  trustMasterId,
}: UseGetTrustMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTrustMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<TrustMasterFormFieldValues>>(
      TRUST_ROUTES.get(trustMasterId)
    );

    return data;
  };

  return useQuery({
    enabled: !!trustMasterId,
    queryFn: fetchTrustMasterDetails,
    queryKey: trustKeys.get(trustMasterId),
  });
}
