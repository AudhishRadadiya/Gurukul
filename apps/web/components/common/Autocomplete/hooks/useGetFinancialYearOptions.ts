import { useQuery } from "@tanstack/react-query";

import { ACCOUNT_YEAR_ROUTES } from "@web/constants/routes/account_year/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { financialYearKeys } from "@web/queryKeysFactories/financialYear";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type FinancialYearOption = {
  end_date: string;
  label: string;
  start_date: string;
  value: string;
};

export type UseGetFinancialYearOptionsArgs = {
  segment?: "option" | "for_report";
};

export function useGetFinancialYearOptions<TData>({
  segment,
}: UseGetFinancialYearOptionsArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const fetchFinancialYearOption = async () => {
    const { data } = await axiosPrivate.get<ApiSuccessResponse<TData[]>>(
      ACCOUNT_YEAR_ROUTES.options(segment)
    );

    return data.data;
  };

  return useQuery({
    initialData: [],
    queryFn: fetchFinancialYearOption,
    queryKey: financialYearKeys.options(),
  });
}
