import { EVENT_PERMISSION_PATH } from "@web/constants/permission/event/permission";
import {
  EVENT_SUMMARY_REPORT,
  PERMISSIONS,
  SUB_MODULES,
  VIEW,
} from "@web/constants/permission/permission";

export const EVENT_SUMMARY_REPORT_PERMISSION_PATH =
  `${EVENT_PERMISSION_PATH}.${SUB_MODULES}.${EVENT_SUMMARY_REPORT}` as const;

export const EVENT_SUMMARY_REPORT_PERMISSION = {
  MENU: `${EVENT_SUMMARY_REPORT_PERMISSION_PATH}.${PERMISSIONS}.${VIEW}`,
} as const;
