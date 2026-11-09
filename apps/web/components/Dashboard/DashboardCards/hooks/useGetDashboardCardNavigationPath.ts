import type { DashboardKey } from "@web/components/Dashboard/DashboardCards/hooks/useGetDashboardCards";

type DateRange = {
  fromDate: string;
  toDate: string;
};

const dashboardCardPathMap: Record<DashboardKey, string> = {
  new_contact_count: "/address/address-book",
  pending_address: "/address/donor-address",
  total_donation_amount: "/donation/donation-entry",
};

export const useGetDashboardCardNavigationPath = (
  key: DashboardKey,
  range: DateRange
): { path: string } => {
  const basePath = dashboardCardPathMap[key];

  const params = new URLSearchParams({
    from_date: range.fromDate,
    to_date: range.toDate,
  });

  const path = `${basePath}?${params.toString()}`;

  return { path };
};
