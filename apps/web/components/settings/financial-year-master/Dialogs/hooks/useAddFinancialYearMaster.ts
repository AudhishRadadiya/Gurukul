import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

import type { FinancialYearMasterFormFieldValues } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@web/types/apiResponse";

type AddFinancialYearMasterApiSuccessResponse =
  ApiSuccessResponse<FinancialYearMasterFormFieldValues>;

type UseAddFinancialYearMasterArgs = {
  options: UseMutationOptions<
    AddFinancialYearMasterApiSuccessResponse,
    ApiErrorResponse<FinancialYearMasterFormFieldValues>,
    Partial<FinancialYearMasterFormFieldValues>
  >;
};

export function useAddFinancialYearMaster({
  options = {},
}: UseAddFinancialYearMasterArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddFinancialYearMasterApiSuccessResponse>(
          ACCOUNT_YEAR_ROUTES.post,
          formValues
        );

      return data;
    },
    mutationKey: financialYearKeys.add(),
    ...options,
  });
}
