import { API, CLONE, LIST, OPTION } from "@web/constants/routes/common";

export const EVENT_MASTER_ROUTES_BASE_URL = `${API}/event_master` as const;

export const EVENT_MASTER_ROUTES = {
  clone: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${CLONE}/${eventMasterId}` as const,

  delete: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  get: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  listing: `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}` as const,

  options: `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  post: `${EVENT_MASTER_ROUTES_BASE_URL}` as const,
} as const;
