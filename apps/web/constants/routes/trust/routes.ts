import { API, LIST, OPTION } from "@web/constants/routes/common";

export const TRUST_ROUTES_BASE_URL = `${API}/trust_master` as const;

export const TRUST_ROUTES = {
  bankOptions: `${TRUST_ROUTES_BASE_URL}/bank-detail` as const,

  delete: (trustId: string) => `${TRUST_ROUTES_BASE_URL}/${trustId}`,

  get: (trustMasterId: string) => `${TRUST_ROUTES_BASE_URL}/${trustMasterId}`,

  listing: `${TRUST_ROUTES_BASE_URL}/${LIST}` as const,

  multipleOptions:
    `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}/branch-wise` as const,

  options: `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  optionsShortName:
    `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}/short-name` as const,

  optionsUserWise:
    `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}/user-wise` as const,

  optionsUserWiseShortName:
    `${TRUST_ROUTES_BASE_URL}/${LIST}/${OPTION}/user-wise/short-name` as const,

  patch: (trustMasterId: string) =>
    `${TRUST_ROUTES_BASE_URL}/${trustMasterId}` as const,

  post: `${TRUST_ROUTES_BASE_URL}` as const,
} as const;

export const getTrustOptionsRoute = (
  useShortName?: boolean,
  useUserWise?: boolean
): string => {
  if (useUserWise && useShortName) {
    return TRUST_ROUTES.optionsUserWiseShortName;
  }

  if (useUserWise) {
    return TRUST_ROUTES.optionsUserWise;
  }

  if (useShortName) {
    return TRUST_ROUTES.optionsShortName;
  }

  return TRUST_ROUTES.options;
};
