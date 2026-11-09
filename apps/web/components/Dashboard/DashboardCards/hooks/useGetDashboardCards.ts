import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";

import { DASHBOARD_ROUTES } from "@web/constants/routes/dashboard/routes";
import { useAxiosPrivate } from "@web/hooks/useAxiosPrivate";
import { dashboardKeys } from "@web/queryKeysFactories/dashboard";
import type { ApiSuccessResponse } from "@web/types/apiResponse";

export type DashboardCards = {
  new_contact_count: number;
  pending_address: number;
  total_donation_amount: number;
};

export type DashboardKey = keyof DashboardCards;

export const DASHBOARD_KEYS: DashboardKey[] = [
  "new_contact_count",
  "pending_address",
  "total_donation_amount",
];

export type GetDashboardCardsSuccessResponse =
  ApiSuccessResponse<DashboardCards>;

type GetDashboardCardsListArgs = Partial<
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

export function useGetDashboardCards(body: GetDashboardCardsListArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  const getDashboardCards = async (body: GetDashboardCardsListArgs) => {
    const { data } = await axiosPrivate.post<GetDashboardCardsSuccessResponse>(
      DASHBOARD_ROUTES.dashboardCards,
      body
    );

    return data.data;
  };

  return useQuery({
    initialData: {
      new_contact_count: 0,
      pending_address: 0,
      total_donation_amount: 0,
    },
    queryFn: () => getDashboardCards(body),
    queryKey: dashboardKeys.dashboardCards(body),
  });
}
