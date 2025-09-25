import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const EVENT_SUMMARY_BASE_URL =
  `${API}/event_master/event_summary_list` as const;

export const EVENT_SUMMARY_ROUTES = {
  export: (fileType: FilType) =>
    `${EVENT_SUMMARY_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${EVENT_SUMMARY_BASE_URL}/${LIST}` as const,
} as const;
