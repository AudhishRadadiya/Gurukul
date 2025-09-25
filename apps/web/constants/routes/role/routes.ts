import { API, LIST, OPTION } from "@web/constants/routes/common";

export const ROLE_BASE_URL = `${API}/role` as const;

export const ROLE_ROUTES = {
  delete: (roleId: string) => `${ROLE_BASE_URL}/${roleId}` as const,

  get: (roleId: string) => `${ROLE_BASE_URL}/${roleId}`,

  listing: `${ROLE_BASE_URL}/${LIST}` as const,

  options: `${ROLE_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (roleId: string) => `${ROLE_BASE_URL}/${roleId}`,

  post: `${ROLE_BASE_URL}` as const,
} as const;
