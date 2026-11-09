import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { DASHBOARD_ROUTES } from "@web/constants/routes/dashboard/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dashboardKeys } from "@web/queryKeysFactories/dashboard";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type DashboardAnniversariesList = {
  age: number;
  branch_id: string | null;
  branch_name: string | null;
  city: string | null;
  contact_id: string;
  contact_no: string | null;
  date: string;
  full_name: string;
  total_years: number;
};

export type GetDashboardAnniversariesListSuccessResponse = ApiSuccessResponse<{
  celebrations: DashboardAnniversariesList[];
  totalCount: number;
}>;

type GetDashboardAnniversariesListArgs = Partial<
  IGetRowsParams & {
    branch_id: string[];
    endRow: number;
    from_date: string;
    is_active: boolean;
    responseFields: string[];
    startRow: number;
    to_date: string;
  }
>;

export function useGetDashboardAnniversariesList(
  body: GetDashboardAnniversariesListArgs
) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDashboardAnniversariesList = async (
    body: GetDashboardAnniversariesListArgs
  ) => {
    const { data } =
      await axiosPrivate.post<GetDashboardAnniversariesListSuccessResponse>(
        DASHBOARD_ROUTES.dashboardAnniversariesList,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { celebrations: [], totalCount: 0 },
    queryFn: () => getDashboardAnniversariesList(body),
    queryKey: dashboardKeys.dashboardAnniversariesList(body),
  });
}
