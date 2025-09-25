import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { BranchMasterFormFieldValues } from "@web/components/settings/branch-master/Dialogs/BranchMasterForm";
import { BRANCH_ROUTES } from "@web/constants/routes/branch/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddBranchMasterApiSuccessResponse =
  ApiSuccessResponse<BranchMasterFormFieldValues>;

type UseAddBranchMasterArgs = {
  options: UseMutationOptions<
    AddBranchMasterApiSuccessResponse,
    ApiErrorResponse<BranchMasterFormFieldValues>,
    Partial<BranchMasterFormFieldValues>
  >;
};

export function useAddBranchMaster({ options = {} }: UseAddBranchMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBranchMasterApiSuccessResponse>(
          BRANCH_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: branchKeys.add(),
    ...options,
  });
}
