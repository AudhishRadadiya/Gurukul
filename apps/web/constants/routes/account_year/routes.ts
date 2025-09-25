import type { UseGetFinancialYearOptionsArgs } from "@web/components/common/Autocomplete/hooks/useGetFinancialYearOptions";
import { API, LIST } from "@web/constants/routes/common";

export const ACCOUNT_YEAR_ROUTES_BASE_URL = `${API}/account_year` as const;

export const ACCOUNT_YEAR_ROUTES = {
  delete: (financialYearId: string) =>
    `${ACCOUNT_YEAR_ROUTES_BASE_URL}/${financialYearId}` as const,

  get: (financialYearId: string) =>
    `${ACCOUNT_YEAR_ROUTES_BASE_URL}/${financialYearId}`,

  listing: `${ACCOUNT_YEAR_ROUTES_BASE_URL}/${LIST}` as const,

  options: (segment: UseGetFinancialYearOptionsArgs["segment"]) =>
    `${ACCOUNT_YEAR_ROUTES_BASE_URL}/${LIST}/${segment}`,

  patch: (financialYearId: string) =>
    `${ACCOUNT_YEAR_ROUTES_BASE_URL}/${financialYearId}`,

  post: ACCOUNT_YEAR_ROUTES_BASE_URL,
} as const;
