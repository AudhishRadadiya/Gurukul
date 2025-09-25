import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import type { BranchMasterFormFieldValues } from "@web/components/settings/branch-master/Dialogs/BranchMasterForm";
import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditBranchMasterApiResponse = ApiSuccessResponse<Branch>;

type UseEditBranchMasterArgs = {
  branchId: string;
  options: UseMutationOptions<
    EditBranchMasterApiResponse,
    ApiErrorResponse<BranchMasterFormFieldValues>,
    Partial<BranchMasterFormFieldValues>
  >;
};

export function useEditBranchMaster({
  branchId,
  options = {},
}: UseEditBranchMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditBranchMasterApiResponse>(
        BRANCH_ROUTES.patch(branchId),
        formValues
      );

      return data;
    },
    mutationKey: branchKeys.edit(branchId),
    ...options,
  });
}
