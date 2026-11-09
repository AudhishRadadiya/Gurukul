import { useQuery } from "@tanstack/react-query";
import _every from "lodash/every";

import { TRUST_ROUTES } from "@web/constants/routes/trust/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { trustKeys } from "@web/queryKeysFactories/trust";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { OptionsType } from "@web/types/options";

type UseGetTrustOptionsFromMultipleBranchArgs = {
  branchIds: string[];
  useShortName?: boolean;
};

export function useGetTrustOptionsFromMultipleBranch({
  branchIds,
  useShortName = false,
}: UseGetTrustOptionsFromMultipleBranchArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchTrustOptions = async () => {
    const url = useShortName
      ? `${TRUST_ROUTES.multipleOptions}/short-name`
      : TRUST_ROUTES.multipleOptions;

    const { data } = await axiosPrivate.post<ApiSuccessResponse<OptionsType[]>>(
      url,
      { branch_ids: branchIds }
    );

    return data.data;
  };

  return useQuery({
    enabled: branchIds?.length > 0 && _every(branchIds, Boolean),
    initialData: [],
    queryFn: fetchTrustOptions,
    queryKey: trustKeys.multipleOptions(branchIds),
  });
}
