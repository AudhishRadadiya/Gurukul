import { useQuery } from "@tanstack/react-query";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

type UseGetTrustOptionsFromMultipleBranchArgs = {
  branchIds: string[];
};

export function useGetTrustOptionsFromMultipleBranch({
  branchIds,
}: UseGetTrustOptionsFromMultipleBranchArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTrustOptions = async () => {
    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      TRUST_ROUTES.multipleOptions,
      { branch_ids: branchIds }
    );

    return data.data;
  };

  return useQuery({
    enabled: !!branchIds.length,
    initialData: [],
    queryFn: fetchTrustOptions,
    queryKey: trustKeys.multipleOptions(branchIds),
  });
}
