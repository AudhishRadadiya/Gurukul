import { LIST } from "@web/constants/routes/common";
import { EVENT_ITEMS_ROUTES_BASE_URL } from "@web/constants/routes/event_master/event_items/routes";
import type { FilType } from "@web/types/shared-types";

export const EVENT_ITEMS_SUMMARY_ROUTES_BASE_URL =
  `${EVENT_ITEMS_ROUTES_BASE_URL}/summary` as const;

export const EVENT_ITEMS_SUMMARY_ROUTES = {
  export: (fileType: FilType) =>
    `${EVENT_ITEMS_SUMMARY_ROUTES_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${EVENT_ITEMS_SUMMARY_ROUTES_BASE_URL}/${LIST}` as const,
} as const;
