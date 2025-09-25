import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteBranchMasterApiResponse = ApiSuccessResponse<Branch>;

type UseDeleteBranchMasterArgs = {
  branchId: string;
  options: UseMutationOptions<DeleteBranchMasterApiResponse, ApiErrorResponse>;
};

export function useDeleteBranchMaster({
  branchId,
  options = {},
}: UseDeleteBranchMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteBranchMasterApiResponse>(
        BRANCH_ROUTES.delete(branchId)
      );

      return data;
    },
    mutationKey: branchKeys.delete(branchId),
    ...options,
  });
}
