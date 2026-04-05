import { EVENT_PERMISSION_PATH } from "@web/constants/permission/event/permission";
import {
    EVENT_ITEM_SUMMARY,
    PERMISSIONS,
    SUB_MODULES,
    VIEW
} from "@web/constants/permission/permission";

export const EVENT_ITEM_SUMMARY_PERMISSION_PATH =
  `${EVENT_PERMISSION_PATH}.${SUB_MODULES}.${EVENT_ITEM_SUMMARY}` as const;

export const EVENT_ITEM_SUMMARY_PERMISSION = {
  MENU: `${EVENT_ITEM_SUMMARY_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
