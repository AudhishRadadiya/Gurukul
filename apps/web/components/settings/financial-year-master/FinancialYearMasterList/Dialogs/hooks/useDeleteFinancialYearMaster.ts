import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { branchKeys } from "@web/queryKeysFactories/branch";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type DeleteBranchMasterApiResponse = ApiSuccessResponse<FinancialYear>;

type UseDeleteFinancialYearMasterArgs = {
  financialYearId: string;
  options: UseMutationOptions<DeleteBranchMasterApiResponse, ApiErrorResponse>;
};

export function useDeleteFinancialYearMaster({
  financialYearId,
  options = {},
}: UseDeleteFinancialYearMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteBranchMasterApiResponse>(
        ACCOUNT_YEAR_ROUTES.delete(financialYearId)
      );

      return data;
    },
    mutationKey: branchKeys.delete(financialYearId),
    ...options,
  });
}
