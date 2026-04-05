import { EVENT_PERMISSION_PATH } from "@web/constants/permission/event/permission";
import {
  EVENT_DROPDOWN_REPORT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";

export const EVENT_DROPDOWN_REPORT_PERMISSION_PATH =
  `${EVENT_PERMISSION_PATH}.${SUB_MODULES}.${EVENT_DROPDOWN_REPORT}` as const;

export const EVENT_DROPDOWN_REPORT_PERMISSION = {
  MENU: `${EVENT_DROPDOWN_REPORT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
