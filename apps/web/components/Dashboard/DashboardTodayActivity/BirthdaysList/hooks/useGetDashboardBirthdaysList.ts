import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { DASHBOARD_ROUTES } from "@web/constants/routes/dashboard/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dashboardKeys } from "@web/queryKeysFactories/dashboard";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type DashboardBirthdaysList = {
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

export type GetDashboardBirthdaysListSuccessResponse = ApiSuccessResponse<{
  celebrations: DashboardBirthdaysList[];
  totalCount: number;
}>;

type GetDashboardBirthdaysListArgs = Partial<
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

export function useGetDashboardBirthdaysList(
  body: GetDashboardBirthdaysListArgs
) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDashboardBirthdaysList = async (
    body: GetDashboardBirthdaysListArgs
  ) => {
    const { data } =
      await axiosPrivate.post<GetDashboardBirthdaysListSuccessResponse>(
        DASHBOARD_ROUTES.dashboardBirthdaysList,
        body
      );

    return data.data;
  };

  return useQuery({
    initialData: { celebrations: [], totalCount: 0 },
    queryFn: () => getDashboardBirthdaysList(body),
    queryKey: dashboardKeys.dashboardBirthdaysList(body),
  });
}
