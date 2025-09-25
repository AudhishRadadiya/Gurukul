import { useQuery } from "@tanstack/react-query";

import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetBranchMasterDetailsArgs = {
  branchId: Branch["branch_id"];
};

export function useGetBranchMasterDetails({
  branchId,
}: UseGetBranchMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchBranchMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<Branch>>(
      BRANCH_ROUTES.get(branchId)
    );

    return data;
  };

  return useQuery({
    enabled: !!branchId,
    queryFn: fetchBranchMasterDetails,
    queryKey: branchKeys.get(branchId),
  });
}
