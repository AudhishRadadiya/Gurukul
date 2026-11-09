import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { DASHBOARD_ROUTES } from "@web/constants/routes/dashboard/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dashboardKeys } from "@web/queryKeysFactories/dashboard";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type LastNDaysTrustWise = {
  donation_date: string;
  donation_mode_wise_total?: Record<string, number | string>;
  short_name: string;
  total_amount: string;
  trust_id: string;
  trust_name: string;
};

export type TrustWiseTotal = {
  short_name: string;
  total_amount: string;
  trust_id: string;
  trust_name: string;
};

export type DashboardCharts = {
  last_n_days_trust_wise: LastNDaysTrustWise[];
  trust_wise_total: TrustWiseTotal[];
};

export type GetDashboardChartsSuccessResponse =
  ApiSuccessResponse<DashboardCharts>;

type GetDashboardChartsListArgs = Partial<
  IGetRowsParams & {
    branch_id: string[];
    days: number;
    donation_mode_ids: string[];
    endRow: number;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
    trust_ids: string[];
  }
>;

export function useGetTrustWiseDonationChartData(
  body: GetDashboardChartsListArgs
) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDashboardCharts = async (body: GetDashboardChartsListArgs) => {
    const { data } = await axiosPrivate.post<GetDashboardChartsSuccessResponse>(
      DASHBOARD_ROUTES.dashboardCharts,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      last_n_days_trust_wise: [],
      trust_wise_total: [],
    },
    queryFn: () => getDashboardCharts(body),
    queryKey: dashboardKeys.dashboardCharts(body),
  });
}
