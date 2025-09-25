import { API, LIST, OPTION } from "@web/constants/routes/common";

export const TRUST_ROUTES_BASE_URL = `${API}/trust_master` as const;

export const TRUST_ROUTES = {
  bankOptions: `${TRUST_ROUTES_BASE_URL}/bank-detail` as const,

  delete: (trustId: string) => `${TRUST_ROUTES_BASE_URL}/${trustId}`,

  get: (trustMasterId: string) => `${TRUST_ROUTES_BASE_URL}/${trustMasterId}`,

  listing: `${TRUST_ROUTES_BASE_URL}/${LIST}` as const,

  multipleOptions:
    `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}/branch-wise` as const,

  options: `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}`,

  patch: (trustMasterId: string) => `${TRUST_ROUTES_BASE_URL}/${trustMasterId}`,

  post: TRUST_ROUTES_BASE_URL,
} as const;
