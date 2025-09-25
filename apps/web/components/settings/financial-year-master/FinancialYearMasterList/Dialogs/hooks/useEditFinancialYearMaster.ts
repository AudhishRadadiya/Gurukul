import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { FinancialYearMasterFormFieldValues } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type EditFinancialYearMasterApiResponse = ApiSuccessResponse<FinancialYear>;

type UseEditFinancialYearMasterArgs = {
  financialYearId: string;
  options: UseMutationOptions<
    EditFinancialYearMasterApiResponse,
    ApiErrorResponse<FinancialYearMasterFormFieldValues>,
    Partial<FinancialYearMasterFormFieldValues>
  >;
};

export function useEditFinancialYearMaster({
  financialYearId,
  options = {},
}: UseEditFinancialYearMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditFinancialYearMasterApiResponse>(
          ACCOUNT_YEAR_ROUTES.patch(financialYearId),
          formValues
        );

      return data;
    },
    mutationKey: financialYearKeys.edit(financialYearId),
    ...options,
  });
}
