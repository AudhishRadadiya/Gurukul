import { useQuery } from "@tanstack/react-query";

import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type { ApiSuccessResponse } from "@web/types/apiResponse";
import type { GetListArgsAg2 } from "@web/types/shared-types";

export type FinancialYear = {
  end_date: string;
  financial_year: string;
  financial_year_id: string;
  full_count: string;
  is_active: boolean;
  is_deleted: boolean;
  start_date: string;
};

export function useGetFinancialYearMaster(body: GetListArgsAg2) {
  const { axiosPrivate } = useAxiosPrivate();

  const getFinancialYear = async (body: GetListArgsAg2) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        financialYearDetails: FinancialYear[];
        totalCount: number;
      }>
    >(ACCOUNT_YEAR_ROUTES.listing, body);

    return data.data;
  };

  return useQuery({
    initialData: { financialYearDetails: [], totalCount: 0 },
    queryFn: () => getFinancialYear(body),
    queryKey: financialYearKeys.listing(body),
  });
}
