import { API, LIST } from "@web/constants/routes/common";

export const SUVICHAR_MASTER_BASE_URL = `${API}/suvichar_master` as const;

export const SUVICHAR_MASTER_ROUTES = {
  delete: (suvicharId: string) =>
    `${SUVICHAR_MASTER_BASE_URL}/${suvicharId}` as const,

  get: (suvicharId: string) =>
    `${SUVICHAR_MASTER_BASE_URL}/${suvicharId}` as const,

  listing: `${SUVICHAR_MASTER_BASE_URL}/${LIST}` as const,

  patch: (suvicharId: string) =>
    `${SUVICHAR_MASTER_BASE_URL}/${suvicharId}` as const,

  post: `${SUVICHAR_MASTER_BASE_URL}` as const,
} as const;
