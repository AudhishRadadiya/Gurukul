import { API, LIST, OPTION } from "@web/constants/routes/common";

export const BRANCH_ROUTES_BASE_URL = `${API}/branch` as const;

export const BRANCH_ROUTES = {
  delete: (branchId: string) => `${BRANCH_ROUTES_BASE_URL}/${branchId}`,

  get: (branchId: string) => `${BRANCH_ROUTES_BASE_URL}/${branchId}`,

  listing: `${BRANCH_ROUTES_BASE_URL}/${LIST}`,

  options: `${BRANCH_ROUTES_BASE_URL}/${LIST}/${OPTION}`,

  patch: (branchId: string) => `${BRANCH_ROUTES_BASE_URL}/${branchId}`,

  post: BRANCH_ROUTES_BASE_URL,
} as const;
