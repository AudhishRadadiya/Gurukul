import { API, LIST, OPTION } from "@web/constants/routes/common";

export const MASTER_TYPE_BASE_URL = `${API}/master_type` as const;

export const MASTER_TYPE_ROUTES = {
  get: (masterTypeId: string) =>
    `${MASTER_TYPE_BASE_URL}/${masterTypeId}` as const,

  listing: `${MASTER_TYPE_BASE_URL}/${LIST}`,

  options: `${MASTER_TYPE_BASE_URL}/${LIST}/${OPTION}` as const,

  parameterOptions:
    `${MASTER_TYPE_BASE_URL}/${LIST}/${OPTION}/parameter` as const,

  patch: (masterTypeId: string) =>
    `${MASTER_TYPE_BASE_URL}/${masterTypeId}` as const,

  post: `${MASTER_TYPE_BASE_URL}` as const,
} as const;
