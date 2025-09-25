import { API, LIST } from "@web/constants/routes/common";
import type { FilType } from "@web/types/shared-types";

export const EVENT_REMINDER_BASE_URL =
  `${API}/event_master/event_reminder_list` as const;

export const EVENT_REMINDER_ROUTES = {
  export: (fileType: FilType) =>
    `${EVENT_REMINDER_BASE_URL}/${LIST}/${fileType}` as const,

  listing: `${EVENT_REMINDER_BASE_URL}/${LIST}` as const,
} as const;
