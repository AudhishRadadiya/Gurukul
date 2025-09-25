import { useQuery } from "@tanstack/react-query";

import type { FinancialYear } from "@web/components/settings/financial-year-master/FinancialYearMasterList/hooks/useGetFinancialYearMaster";
import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

type UseGetFinancialYearMasterDetailsArgs = {
  financialYearId: FinancialYear["financial_year_id"];
};

export function useGetFinancialYearMasterDetails({
  financialYearId,
}: UseGetFinancialYearMasterDetailsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchFinancialYearMasterDetails = async () => {
    const {
      data: { data },
    } = await axiosPrivate.get<ApiSuccessResponse<FinancialYear>>(
      ACCOUNT_YEAR_ROUTES.get(financialYearId)
    );

    return data;
  };

  return useQuery({
    enabled: !!financialYearId,
    queryFn: fetchFinancialYearMasterDetails,
    queryKey: financialYearKeys.get(financialYearId),
  });
}
