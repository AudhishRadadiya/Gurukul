import { EVENT_PERMISSION_PATH } from "@web/constants/permission/event/permission";
import {
  EVENT_REMINDER_LIST,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";

export const EVENT_REMINDER_LIST_PERMISSION_PATH =
  `${EVENT_PERMISSION_PATH}.${SUB_MODULES}.${EVENT_REMINDER_LIST}` as const;

export const EVENT_REMINDER_LIST_PERMISSION = {
  MENU: `${EVENT_REMINDER_LIST_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
