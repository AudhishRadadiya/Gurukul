import { API, CLONE, LIST, OPTION, ALL } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const EVENT_MASTER_ROUTES_BASE_URL = `${API}/event_master` as const;

export const EVENT_MASTER_ROUTES = {
  clone: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${CLONE}/${eventMasterId}` as const,

  delete: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  eventDropdownOptions: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/event-dropdown/${LIST}/${OPTION}/${eventMasterId}` as const,

  filterOptions:
    `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}/${ALL}` as const,

  filterOptionsUserWise:
    `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}/user-wise/${ALL}` as const,

  get: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  listing: `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}` as const,

  multipleFilterOptions:
    `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}/branch-wise/${ALL}` as const,

  multipleOptions:
    `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}/branch-wise` as const,

  options: `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  optionsUserWise:
    `${EVENT_MASTER_ROUTES_BASE_URL}/${LIST}/${OPTION}/user-wise` as const,

  patch: (eventMasterId: string) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/${eventMasterId}` as const,

  post: `${EVENT_MASTER_ROUTES_BASE_URL}` as const,
} as const;

export const EVENT_DROPDOWN_SUMMARY_ROUTES = {
  export: (fileType: FilType) =>
    `${EVENT_MASTER_ROUTES_BASE_URL}/event-dropdown/${LIST}/${fileType}` as const,

  listing: `${EVENT_MASTER_ROUTES_BASE_URL}/event-dropdown/${LIST}` as const,
} as const;
