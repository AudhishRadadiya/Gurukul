import { API, LIST, OPTION } from "@web/constants/routes/common";

export const EVENT_CONTACT_DETAIL_ROUTES_BASE_URL =
  `${API}/event_contact_detail` as const;

export const EVENT_CONTACT_DETAIL_ROUTES = {
  delete: (eventContactDetailId: string) =>
    `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}/${eventContactDetailId}` as const,

  get: (eventContactDetailId: string) =>
    `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}/${eventContactDetailId}` as const,

  listing: `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}/${LIST}` as const,

  options: `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}/${LIST}/${OPTION}` as const,

  patch: (eventContactDetailId: string) =>
    `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}/${eventContactDetailId}` as const,

  post: `${EVENT_CONTACT_DETAIL_ROUTES_BASE_URL}` as const,
} as const;
